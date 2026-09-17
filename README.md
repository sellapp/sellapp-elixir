# SellApp for Elixir

Read your SellApp catalog, build a checkout, or bring order data into your Elixir
app. This SDK is the library that makes those API requests and gives you Elixir
structs back, wrapped in `{:ok, result}` or `{:error, error}` tuples.

We'll start with one product and print its name. One request, one useful result,
and no changes to your store.
Already know the basics? Jump to [configuration](https://github.com/sellapp/sellapp-elixir/blob/main/docs/usage.md#client-configuration) or the
[method index](https://github.com/sellapp/sellapp-elixir/blob/main/docs/methods.md).

## Availability and installation

**Start with a local checkout.** This is pre-release source for the planned
**0.1.0** release; registry publication and namespace ownership are unconfirmed.
You'll need access to the private
[sellapp-elixir](https://github.com/sellapp/sellapp-elixir) repository.

The package declares **Elixir ~> 1.15**. Native validation runs on Elixir 1.20.4
with OTP 28.4; the declared minimum and an independent minimum OTP version have
not been verified. Use a compatible Erlang/OTP installation and Mix.

Tell Mix where to find your local SDK. Add this entry to your application's
`mix.exs` dependency list, replacing the placeholder with your checkout's path:

```elixir
{:sellapp, path: "/path/to/sellapp-elixir"}
```

Then run `mix deps.get` to install dependencies. If you'd like to try the examples
before adding the SDK to your app, run these commands in the SDK checkout itself:

```sh
mix deps.get
mix compile
```


## Your first request

Let's ask your store for one product. You need a secret API key with the
`listing` ability (permission to read the catalog), plus your store slug.
For `launch-lab.sell.app`, the slug is `launch-lab`.

The [authentication guide](https://sell.app/docs/api/authentication) explains key
setup and access rules. Keep the key on your server and out of Git.

Run these commands in a Bash-compatible terminal from the SDK checkout, replacing
the key and store. The `export` lines set environment variables: values the
script reads without keeping secrets in its source code.

```sh
export SELLAPP_API_KEY='replace-with-your-key'
export SELLAPP_STORE='launch-lab'
export SELLAPP_API_BASE_URL='https://sell.app/api'
mix run examples/first-request.exs
```

This endpoint reads your real store. `SELLAPP_API_BASE_URL` is an example variable
passed explicitly to the client, not a built-in SDK setting. Use `SELLAPP_STORE`
consistently across the API guides.

Here's the complete [first-request.exs](https://github.com/sellapp/sellapp-elixir/blob/main/examples/first-request.exs) script you just
ran. It builds the client, requests one product, and prints the result:

```elixir
base_url = System.fetch_env!("SELLAPP_API_BASE_URL")
if base_url == "", do: raise("Set SELLAPP_API_BASE_URL before running this example")

client = SellApp.client(base_url: base_url)
# Credentials come from SELLAPP_API_KEY and SELLAPP_STORE.

{:ok, page} = SellApp.Products.list(client, %{limit: 1})
Enum.each(page.data, fn product -> IO.puts("#{product.id} #{product.title}") end)
if page.data == [], do: IO.puts("No products yet. The request worked!")
```

You should see a product ID and title from your own store. If the store is empty,
you'll see the success message instead. The connection still worked.

The `{:ok, page}` match unwraps a successful result. Here, `page` is a
`SellApp.Page` and `page.data` is its list of product structs. This first script
deliberately stops if the request fails; the error example below handles failures
with `case`. Struct fields use snake_case; date-time fields remain ISO 8601 strings.

## Account access and first-store setup

Create a user-owned key in [API keys](https://sell.app/user/api-tokens), even
before you have a store. Enable `account:read` for identity, store discovery and
permission inspection, and `stores:create` separately for store creation.
Identity, discovery, store detail by ID and creation omit `X-STORE`; permission
inspection and business requests select a store explicitly.

An unrestricted key covers current and future accessible stores. A selected-store
key covers only its fixed list; an empty list covers none. Membership and role
changes still apply. Selected-store keys cannot create stores. Existing keys do
not gain abilities automatically; `*` satisfies the new abilities while retaining
membership, role and restriction checks.

The [account guide](https://sell.app/docs/api/authentication#discover-your-account-before-selecting-a-store)
shows first-store creation, required idempotency keys, and bounded reads across
several stores with partial failures. Creation returns an ID and slug; use the
slug for subsequent product requests. Find your language's methods in the
[resource reference](https://github.com/sellapp/sellapp-elixir/blob/main/docs/methods.md). CLI and MCP connections retain browser OAuth.

## If the request fails

| Result | Next step |
| --- | --- |
| Empty product list | The read succeeded. Create a product when you are ready. |
| 401 | Check the selected credential and whether it has expired or been revoked. |
| 403 | Check the key's listing ability, selected-store restrictions and the account's current store permissions. Official CLI OAuth also requires its active grant. |
| 400 with a missing-store message | Set SELLAPP_STORE to an authorized store slug. |
| 429 | Follow Retry-After and the SDK's documented retry behavior. |

Keep the request ID when reporting an API failure. Never include credentials.

## Three useful next actions

1. [Create and edit a product](https://github.com/sellapp/sellapp-elixir/blob/main/docs/resources/products.md): exact signatures and complete examples.
2. [Read orders or create a checkout](https://github.com/sellapp/sellapp-elixir/blob/main/docs/resources/orders.md): inspect permissions and effects before changing a purchase.
3. [Read more than one page](https://github.com/sellapp/sellapp-elixir/blob/main/docs/usage.md): pagination, request controls, errors, and retry behavior.

## Reference and examples

- [Resource reference](https://github.com/sellapp/sellapp-elixir/blob/main/docs/methods.md)
- [Runnable examples](https://github.com/sellapp/sellapp-elixir/blob/main/examples/README.md)
- [API documentation](https://sell.app/docs/api)

## Support and releases

This source candidate is not a verified registry release. Use the source installation above.
[Report an SDK issue](https://github.com/sellapp/sellapp-elixir/issues) if you have repository access.
Include the SDK version, runtime version, and a redacted reproduction.
Licensed under [MIT](https://github.com/sellapp/sellapp-elixir/blob/main/LICENSE.txt); see [third-party notices](https://github.com/sellapp/sellapp-elixir/blob/main/NOTICE.txt).
