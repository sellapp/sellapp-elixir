base_url = System.fetch_env!("SELLAPP_API_BASE_URL")
if base_url == "", do: raise("Set SELLAPP_API_BASE_URL before running this example")

client = SellApp.client(base_url: base_url)
# Credentials come from SELLAPP_API_KEY and SELLAPP_STORE.

case SellApp.Products.list(client, %{limit: 1}) do
  {:ok, page} ->
    IO.puts("Products on this page: #{length(page.data)}")

  {:error, %SellApp.Error.Authentication{} = error} ->
    IO.puts("#{error.status} #{error.code} #{error.message} #{error.request_id}")

  {:error, %SellApp.Error.Api{} = error} ->
    IO.puts("#{error.status} #{error.code} #{error.message} #{error.request_id}")

  {:error, %SellApp.Error.Timeout{} = error} ->
    IO.puts("Request timed out: #{error.message}")

  {:error, %SellApp.Error.Transport{} = error} ->
    IO.puts("Connection failed: #{error.message}")

  {:error, error} ->
    raise error
end
