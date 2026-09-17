base_url = System.fetch_env!("SELLAPP_API_BASE_URL")
if base_url == "", do: raise("Set SELLAPP_API_BASE_URL before running this example")

client = SellApp.client(base_url: base_url)
# Credentials come from SELLAPP_API_KEY and SELLAPP_STORE.

# Explicit page numbers keep failures visible and the request count bounded.
Enum.reduce_while(1..100, :ok, fn page_number, :ok ->
  case SellApp.Products.list(client, %{limit: 20, page: page_number}) do
    {:ok, page} ->
      Enum.each(page.data, fn product -> IO.puts("#{product.id} #{product.title}") end)
      last_page = page.meta["last_page"]

      cond do
        is_integer(last_page) and page_number >= last_page ->
          {:halt, :ok}

        page_number == 100 ->
          raise "Page budget reached; resume from page 101"

        true ->
          {:cont, :ok}
      end

    {:error, error} ->
      raise error
  end
end)
