# oauth_management

[All resources](../methods.md)

## get_oauth_installation

Read your CLI connection

[API reference](https://sell.app/docs/api/oauth) · Effect: **read**

```elixir
def get_oauth_installation(client, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  access_token: System.fetch_env!("SELLAPP_ACCESS_TOKEN"),
  store: ""
)

{:ok, result} = SellApp.OAuthManagement.get_oauth_installation(client)
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "oauthAccessToken": [
      "admin"
    ]
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## delete_oauth_installation

Disconnect your CLI connection

[API reference](https://sell.app/docs/api/oauth) · Effect: **consequential**

```elixir
def delete_oauth_installation(client, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  access_token: System.fetch_env!("SELLAPP_ACCESS_TOKEN"),
  store: ""
)

{:ok, result} = SellApp.OAuthManagement.delete_oauth_installation(client)
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "oauthAccessToken": [
      "admin"
    ]
  }
]
```

Documented HTTP responses: 204, 400, 401, 403, 404, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

