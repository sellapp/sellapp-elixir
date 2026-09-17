base_url = System.fetch_env!("SELLAPP_API_BASE_URL")
if base_url == "", do: raise("Set SELLAPP_API_BASE_URL before running this example")

client = SellApp.client(base_url: base_url)
# Credentials come from SELLAPP_API_KEY and SELLAPP_STORE.

{:ok, page} = SellApp.Products.list(client, %{limit: 1})
Enum.each(page.data, fn product -> IO.puts("#{product.id} #{product.title}") end)
if page.data == [], do: IO.puts("No products yet. The request worked!")
