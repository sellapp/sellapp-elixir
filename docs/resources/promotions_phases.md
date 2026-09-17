# promotions_phases

[All resources](../methods.md)

## list

List promotion phases

[API reference](https://sell.app/docs/api/promotions/replace-promotion-phases) · Effect: **read**

```elixir
def list(client, promotion, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| promotion | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.PromotionsPhases.list(client, 1)
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

Replace promotion phases

[API reference](https://sell.app/docs/api/promotions/replace-promotion-phases) · Effect: **consequential**

```elixir
def replace(client, promotion, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| promotion | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.PromotionsPhases.replace(client, 1, %{"phases" => [%{"discount_type" => "percentage", "discount_value" => "20", "ends_at" => "2026-08-04T00:00:00Z", "max_redemptions" => 200, "minimum_amount" => "10"}, %{"discount_type" => "fixed", "discount_value" => "5", "ends_at" => nil, "max_redemptions" => nil, "minimum_amount" => "25"}]})
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

