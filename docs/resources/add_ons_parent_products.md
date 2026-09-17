# add_ons_parent_products

[All resources](../methods.md)

## list

List an add-on's parent products

[API reference](https://sell.app/docs/api/add-ons/list-parent-products) · Effect: **read**

```elixir
def list(client, addon, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| addon | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.AddOnsParentProducts.list(client, 1, %{})
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "bearerAuth": []
  },
  {
    "oauthAccessToken": [
      "admin"
    ],
    "storeAuth": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## replace

Replace an add-on's parent products

[API reference](https://sell.app/docs/api/add-ons/replace-parent-products) · Effect: **consequential**

```elixir
def replace(client, addon, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| addon | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.AddOnsParentProducts.replace(client, 410, %{"resources" => [121, 120]})
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "bearerAuth": []
  },
  {
    "oauthAccessToken": [
      "admin"
    ],
    "storeAuth": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

