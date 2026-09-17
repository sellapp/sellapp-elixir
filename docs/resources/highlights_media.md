# highlights_media

[All resources](../methods.md)

## list

List highlight media

[API reference](https://sell.app/docs/api/highlights/manage-highlight-media) · Effect: **read**

```elixir
def list(client, highlight, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| highlight | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.HighlightsMedia.list(client, 1)
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

## add

Add highlight media

[API reference](https://sell.app/docs/api/highlights/manage-highlight-media) · Effect: **write**

```elixir
def add(client, highlight, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| highlight | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.HighlightsMedia.add(client, 1, %{"file" => "/path/to/example.png", "cta_title" => "View product", "product_id" => 123})
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

Documented HTTP responses: 201, 400, 401, 403, 404, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## reorder

Reorder highlight media

[API reference](https://sell.app/docs/api/highlights/manage-highlight-media) · Effect: **consequential**

```elixir
def reorder(client, highlight, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| highlight | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.HighlightsMedia.reorder(client, 1, %{"resources" => [42, 41]})
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

Replace highlight media

[API reference](https://sell.app/docs/api/highlights/manage-highlight-media) · Effect: **write**

```elixir
def replace(client, highlight, media, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| highlight | `any` | Yes |
| media | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.HighlightsMedia.replace(client, 1, 84, %{"file" => "/path/to/example.png", "cta_title" => "View product", "product_id" => 123})
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

## replace_metadata

Update highlight media

[API reference](https://sell.app/docs/api/highlights/manage-highlight-media) · Effect: **write**

```elixir
def replace_metadata(client, highlight, media, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| highlight | `any` | Yes |
| media | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.HighlightsMedia.replace_metadata(client, 1, 84, %{"cta_title" => "View product", "product_id" => 123})
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

## update

Update highlight media

[API reference](https://sell.app/docs/api/highlights/manage-highlight-media) · Effect: **write**

```elixir
def update(client, highlight, media, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| highlight | `any` | Yes |
| media | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.HighlightsMedia.update(client, 1, 84, %{"cta_title" => "View product", "product_id" => 123})
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

## delete

Delete highlight media

[API reference](https://sell.app/docs/api/highlights/manage-highlight-media) · Effect: **consequential**

```elixir
def delete(client, highlight, media, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| highlight | `any` | Yes |
| media | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.HighlightsMedia.delete(client, 1, 84)
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

