# courses_sections

[All resources](../methods.md)

## create

Create a course section

[API reference](https://sell.app/docs/api/courses/manage-course-sections) · Effect: **write**

```elixir
def create(client, course, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| course | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.CoursesSections.create(client, "string_example", %{"title" => "Getting started"})
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

## replace

Update a course section

[API reference](https://sell.app/docs/api/courses/manage-course-sections) · Effect: **write**

```elixir
def replace(client, course, section, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| course | `any` | Yes |
| section | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.CoursesSections.replace(client, "string_example", 1, %{"title" => "Getting started"})
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

Update a course section

[API reference](https://sell.app/docs/api/courses/manage-course-sections) · Effect: **write**

```elixir
def update(client, course, section, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| course | `any` | Yes |
| section | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.CoursesSections.update(client, "string_example", 1, %{"title" => "Getting started"})
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

Delete a course section

[API reference](https://sell.app/docs/api/courses/manage-course-sections) · Effect: **consequential**

```elixir
def delete(client, course, section, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| course | `any` | Yes |
| section | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.CoursesSections.delete(client, "string_example", 1)
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

## reorder

Reorder course sections

[API reference](https://sell.app/docs/api/courses/reorder-course-sections) · Effect: **consequential**

```elixir
def reorder(client, course, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| course | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  api_key: System.fetch_env!("SELLAPP_API_KEY"),
  store: System.fetch_env!("SELLAPP_STORE")
)

{:ok, result} = SellApp.CoursesSections.reorder(client, "string_example", %{"resources" => [501, 502]})
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

