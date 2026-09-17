# entitlements

[All resources](../methods.md)

## list_customer_entitlements

List customer entitlements

[API reference](https://sell.app/docs/api/customers/identity-and-entitlements) · Effect: **read**

```elixir
def list_customer_entitlements(client, customer, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| customer | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.Entitlements.list_customer_entitlements(client, 42)
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

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## list_customer_entitlements_by_external_id

List customer entitlements

[API reference](https://sell.app/docs/api/customers/identity-and-entitlements) · Effect: **read**

```elixir
def list_customer_entitlements_by_external_id(client, external_id, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| external_id | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.Entitlements.list_customer_entitlements_by_external_id(client, "externalId_01K4CUSTOMER")
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

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

