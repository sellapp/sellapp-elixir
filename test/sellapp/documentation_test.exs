defmodule SellApp.DocumentationTest do
  use ExUnit.Case, async: false
  import ExUnit.CaptureIO

  @root Path.expand("../..", __DIR__)

  test "exact README and example scripts use public modules against localhost" do
    first = File.read!(Path.join(@root, "examples/first-request.exs"))
    assert File.read!(Path.join(@root, "README.md")) =~ String.trim(first)

    for {mode, expected} <- [
          {:first, "1 title"},
          {:empty, "No products yet"},
          {:pagination, "3 title"},
          {:errors, "401 unauthenticated Dummy key rejected req-docs"}
        ] do
      {:ok, listener} =
        :gen_tcp.listen(0, [:binary, active: false, ip: {127, 0, 0, 1}, reuseaddr: true])

      {:ok, port} = :inet.port(listener)
      count = if mode == :pagination, do: 3, else: 1
      fixture = SellApp.TestFixtures.fixture("products/list")
      task = Task.async(fn -> serve(listener, mode, count, fixture) end)

      old =
        Map.new(~w(SELLAPP_API_KEY SELLAPP_STORE SELLAPP_API_BASE_URL), &{&1, System.get_env(&1)})

      System.put_env("SELLAPP_API_KEY", "docs-dummy")
      System.put_env("SELLAPP_STORE", "docs-store")
      System.put_env("SELLAPP_API_BASE_URL", "http://127.0.0.1:#{port}")

      try do
        name = if mode in [:first, :empty], do: "first-request", else: Atom.to_string(mode)
        output = capture_io(fn -> Code.eval_file(Path.join(@root, "examples/#{name}.exs")) end)
        assert output =~ expected
        assert Task.await(task, 10_000) == :ok
      after
        :gen_tcp.close(listener)

        Enum.each(old, fn {key, value} ->
          if value, do: System.put_env(key, value), else: System.delete_env(key)
        end)
      end
    end
  end

  test "connected catalog uses returned IDs and isolates client credentials" do
    Code.require_file(Path.join(@root, "examples/catalog.exs"))

    client =
      SellApp.Client.new(
        api_key: "catalog_key",
        store: "launch-lab",
        req_options: [plug: {Req.Test, SellApp.Client}]
      )

    other =
      SellApp.Client.new(
        api_key: "other_key",
        store: "other-store",
        req_options: [plug: {Req.Test, SellApp.Client}]
      )

    parent = self()

    Req.Test.stub(SellApp.Client, fn conn ->
      key = Plug.Conn.get_req_header(conn, "authorization") |> hd()
      store = Plug.Conn.get_req_header(conn, "x-store") |> hd()
      assert store == if(key == "Bearer other_key", do: "other-store", else: "launch-lab")
      send(parent, {:catalog_request, conn.method, key})

      operation =
        case conn.method do
          "POST" -> "create"
          "PATCH" -> "update"
          "GET" -> "get"
        end

      assert String.ends_with?(
               conn.request_path,
               if(operation == "create", do: "/v2/products", else: "/v2/products/120")
             )

      if operation != "get" do
        {:ok, body, _} = Plug.Conn.read_body(conn)

        assert Jason.decode!(body)["title"] ==
                 if(operation == "create", do: "Design kit", else: "Design kit revised")
      end

      fixture = SellApp.TestFixtures.fixture("products/" <> operation)
      fixture = put_in(fixture, ["data", "id"], 120)
      Req.Test.json(conn, fixture)
    end)

    assert {:ok, 120} = SellApp.Examples.Catalog.run(client)
    assert {:ok, _} = SellApp.Products.get(other, "120")
    assert {:ok, _} = SellApp.Products.get(client, "120")
    assert_receive {:catalog_request, "POST", "Bearer catalog_key"}
    assert_receive {:catalog_request, "GET", "Bearer catalog_key"}
    assert_receive {:catalog_request, "PATCH", "Bearer catalog_key"}
    assert_receive {:catalog_request, "GET", "Bearer other_key"}
    assert_receive {:catalog_request, "GET", "Bearer catalog_key"}
  end

  test "connected checkout and upload carry returned IDs" do
    Code.require_file(Path.join(@root, "examples/catalog.exs"))

    client =
      SellApp.Client.new(
        api_key: "catalog_key",
        store: "launch-lab",
        max_retries: 0,
        req_options: [plug: {Req.Test, SellApp.Client}]
      )

    parent = self()

    Req.Test.stub(SellApp.Client, fn conn ->
      assert Plug.Conn.get_req_header(conn, "authorization") == ["Bearer catalog_key"]

      {fixture, id} =
        case {conn.method, conn.request_path} do
          {"GET", "/api/v2/orders/9001"} ->
            {"orders/get", 9001}

          {"POST", "/api/v2/orders/9001/checkout"} ->
            {"orders/create_checkout", 9001}

          {"POST", "/api/v2/products/120/variants/4321/deliverable/files"} ->
            assert hd(Plug.Conn.get_req_header(conn, "content-type")) =~ "multipart/form-data"
            {:ok, body, _} = Plug.Conn.read_body(conn)
            assert body =~ "Design kit fixture"
            {"variant_deliverable_files/upload", 81}

          {"GET", "/api/v2/products/120/variants/4321/deliverable/files/81"} ->
            {"variant_deliverable_files/get", 81}
        end

      send(parent, {:effect_request, fixture})
      Req.Test.json(conn, put_in(SellApp.TestFixtures.fixture(fixture), ["data", "id"], id))
    end)

    assert {:ok, 9001} = SellApp.Examples.Catalog.checkout(client, "9001")

    assert {:ok, 81} =
             SellApp.Examples.Catalog.upload(client, "120", "4321", "Design kit fixture")

    assert_receive {:effect_request, "orders/get"}
    assert_receive {:effect_request, "orders/create_checkout"}
    assert_receive {:effect_request, "variant_deliverable_files/upload"}
    assert_receive {:effect_request, "variant_deliverable_files/get"}
  end

  test "missing endpoint fails before transport" do
    old = System.get_env("SELLAPP_API_BASE_URL")
    System.delete_env("SELLAPP_API_BASE_URL")

    try do
      assert_raise System.EnvError, fn ->
        Code.eval_file(Path.join(@root, "examples/first-request.exs"))
      end
    after
      if old, do: System.put_env("SELLAPP_API_BASE_URL", old)
    end
  end

  defp serve(listener, mode, count, fixture) do
    for page <- 1..count do
      {:ok, socket} = :gen_tcp.accept(listener, 10_000)
      request = read_headers(socket, "")
      assert String.starts_with?(request, "GET /v2/products?")
      assert String.downcase(request) =~ "authorization: bearer docs-dummy"
      assert String.downcase(request) =~ "x-store: docs-store"
      if mode == :pagination, do: assert(request =~ "page=#{page}")
      product = fixture["data"] |> hd() |> Map.put("id", page)

      body =
        fixture
        |> Map.put(
          "data",
          if(mode == :empty or (mode == :pagination and page == 2), do: [], else: [product])
        )
        |> Map.put("meta", %{"current_page" => page, "last_page" => count})
        |> Map.put("links", %{"next" => if(page < count, do: "?page=#{page + 1}", else: nil)})

      {status, body} =
        if mode == :errors,
          do: {401, %{"code" => "unauthenticated", "message" => "Dummy key rejected"}},
          else: {200, body}

      json = Jason.encode!(body)

      :ok =
        :gen_tcp.send(
          socket,
          "HTTP/1.1 #{status} Result\r\ncontent-type: application/json\r\nx-request-id: req-docs\r\ncontent-length: #{byte_size(json)}\r\nconnection: close\r\n\r\n#{json}"
        )

      :gen_tcp.close(socket)
    end

    :ok
  end

  defp read_headers(socket, bytes) do
    if String.contains?(bytes, "\r\n\r\n") do
      bytes
    else
      {:ok, next} = :gen_tcp.recv(socket, 0, 10_000)
      read_headers(socket, bytes <> next)
    end
  end
end
