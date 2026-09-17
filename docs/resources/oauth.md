# oauth

[All resources](../methods.md)

## get_oauth_authorization_server_metadata

Read OAuth server metadata

[API reference](https://sell.app/docs/api/oauth) · Effect: **read**

```elixir
def get_oauth_authorization_server_metadata(client, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: "",
  store: ""
)

{:ok, result} = SellApp.OAuth.get_oauth_authorization_server_metadata(client)
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[]
```

Documented HTTP responses: 200, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## get_oauth_authorization_request

Review CLI authorization

[API reference](https://sell.app/docs/api/oauth) · Effect: **read**

```elixir
def get_oauth_authorization_request(client, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: "",
  store: ""
)

{:ok, result} = SellApp.OAuth.get_oauth_authorization_request(client, %{"response_type" => "code", "client_id" => "01992a65-e064-71ba-b38f-902b7966a6be", "redirect_uri" => "http://127.0.0.1:49152/callback", "state" => "RANDOM_STATE", "code_challenge" => "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM", "code_challenge_method" => "S256"})
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[]
```

Documented HTTP responses: 200, 302, 400, 401, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## approve_oauth_authorization

Approve CLI access

[API reference](https://sell.app/docs/api/oauth) · Effect: **consequential**

```elixir
def approve_oauth_authorization(client, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  browser_session: System.fetch_env!("SELLAPP_BROWSER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.OAuth.approve_oauth_authorization(client, %{"auth_token" => "CONSENT_AUTH_TOKEN", "client_id" => "01992a65-e064-71ba-b38f-902b7966a6be", "state" => "RANDOM_STATE", "_token" => "CSRF_TOKEN"})
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "oauthBrowserSession": []
  }
]
```

Documented HTTP responses: 302, 400, 401, 403, 419, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## deny_oauth_authorization

Deny CLI access

[API reference](https://sell.app/docs/api/oauth) · Effect: **consequential**

```elixir
def deny_oauth_authorization(client, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  browser_session: System.fetch_env!("SELLAPP_BROWSER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.OAuth.deny_oauth_authorization(client, %{"auth_token" => "CONSENT_AUTH_TOKEN", "_token" => "CSRF_TOKEN"})
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "oauthBrowserSession": []
  }
]
```

Documented HTTP responses: 302, 400, 401, 419, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## exchange_oauth_token

Exchange or refresh OAuth tokens

[API reference](https://sell.app/docs/api/oauth) · Effect: **consequential**

```elixir
def exchange_oauth_token(client, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: "",
  store: ""
)

{:ok, result} = SellApp.OAuth.exchange_oauth_token(client, %{"client_id" => "01992a65-e064-71ba-b38f-902b7966a6be", "grant_type" => "authorization_code", "code" => "AUTHORIZATION_CODE", "redirect_uri" => "http://127.0.0.1:49152/callback", "code_verifier" => "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"})
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {},
  {
    "oauthClientBasic": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## revoke_oauth_token

Revoke an OAuth token

[API reference](https://sell.app/docs/api/oauth) · Effect: **consequential**

```elixir
def revoke_oauth_token(client, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: "",
  store: ""
)

{:ok, result} = SellApp.OAuth.revoke_oauth_token(client, %{"client_id" => "01992a65-e064-71ba-b38f-902b7966a6be", "token" => "REFRESH_TOKEN", "token_type_hint" => "refresh_token"})
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {},
  {
    "oauthClientBasic": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

