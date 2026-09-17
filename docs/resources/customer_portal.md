# customer_portal

[All resources](../methods.md)

## get_customer_portal_profile

Retrieve the signed-in customer

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **read**

```elixir
def get_customer_portal_profile(client, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.get_customer_portal_profile(client)
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## update_customer_portal_profile

Update the signed-in customer

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **consequential**

```elixir
def update_customer_portal_profile(client, params \\ %{}, opts \\ [])
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
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.update_customer_portal_profile(client, %{"locale" => "en-US"})
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## list_customer_portal_orders

List customer orders

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **read**

```elixir
def list_customer_portal_orders(client, params \\ %{}, opts \\ [])
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
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.list_customer_portal_orders(client, %{})
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## get_customer_portal_order

Retrieve a customer order

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **read**

```elixir
def get_customer_portal_order(client, order, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| order | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.get_customer_portal_order(client, 9001)
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## list_customer_portal_subscriptions

List customer subscriptions

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **read**

```elixir
def list_customer_portal_subscriptions(client, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.list_customer_portal_subscriptions(client)
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## get_customer_portal_subscription

Retrieve a customer subscription

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **read**

```elixir
def get_customer_portal_subscription(client, subscription, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| subscription | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.get_customer_portal_subscription(client, 991)
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## get_customer_portal_subscription_capabilities

Retrieve subscription capabilities

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **read**

```elixir
def get_customer_portal_subscription_capabilities(client, subscription, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| subscription | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.get_customer_portal_subscription_capabilities(client, 42)
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## list_customer_portal_entitlements

List customer entitlements

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **read**

```elixir
def list_customer_portal_entitlements(client, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.list_customer_portal_entitlements(client)
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## cancel_customer_subscription_at_period_end

Cancel at period end

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **consequential**

```elixir
def cancel_customer_subscription_at_period_end(
        client,
        product_subscription,
        params \\ %{},
        opts \\ []
      )
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| product_subscription | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.cancel_customer_subscription_at_period_end(client, 42, %{"reason" => "Customer requested this change"}, idempotency_key: "example-mutation-001")
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## cancel_customer_subscription_immediately

Cancel immediately

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **consequential**

```elixir
def cancel_customer_subscription_immediately(
        client,
        product_subscription,
        params \\ %{},
        opts \\ []
      )
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| product_subscription | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.cancel_customer_subscription_immediately(client, 42, %{"reason" => "Customer requested this change"}, idempotency_key: "example-mutation-001")
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## pause_customer_subscription

Pause a subscription

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **consequential**

```elixir
def pause_customer_subscription(client, product_subscription, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| product_subscription | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.pause_customer_subscription(client, 42, %{"reason" => "Customer requested this change"}, idempotency_key: "example-mutation-001")
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## resume_customer_subscription

Resume a subscription

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **consequential**

```elixir
def resume_customer_subscription(client, product_subscription, params \\ %{}, opts \\ [])
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| product_subscription | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.resume_customer_subscription(client, 42, %{"reason" => "Customer requested this change"}, idempotency_key: "example-mutation-001")
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## update_customer_subscription_payment_method

Update payment method

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **consequential**

```elixir
def update_customer_subscription_payment_method(
        client,
        product_subscription,
        params \\ %{},
        opts \\ []
      )
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| product_subscription | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.update_customer_subscription_payment_method(client, 42, %{"reason" => "Customer requested this change"}, idempotency_key: "example-mutation-001")
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## preview_customer_subscription_plan_change

Preview a plan change

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **consequential**

```elixir
def preview_customer_subscription_plan_change(
        client,
        product_subscription,
        params \\ %{},
        opts \\ []
      )
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| product_subscription | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.preview_customer_subscription_plan_change(client, 42, %{"product_variant_id" => 84}, idempotency_key: "example-mutation-001")
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## confirm_customer_subscription_plan_change

Confirm a plan change

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **consequential**

```elixir
def confirm_customer_subscription_plan_change(
        client,
        product_subscription,
        params \\ %{},
        opts \\ []
      )
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| product_subscription | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.confirm_customer_subscription_plan_change(client, 42, %{"preview_id" => "preview_01K4"}, idempotency_key: "example-mutation-001")
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## preview_customer_subscription_renewal_date_change

Preview a renewal-date change

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **consequential**

```elixir
def preview_customer_subscription_renewal_date_change(
        client,
        product_subscription,
        params \\ %{},
        opts \\ []
      )
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| product_subscription | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.preview_customer_subscription_renewal_date_change(client, 42, %{"renewal_date" => "2026-10-15"}, idempotency_key: "example-mutation-001")
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

## confirm_customer_subscription_renewal_date_change

Confirm a renewal-date change

[API reference](https://sell.app/docs/api/customer-portal) · Effect: **consequential**

```elixir
def confirm_customer_subscription_renewal_date_change(
        client,
        product_subscription,
        params \\ %{},
        opts \\ []
      )
```

| Argument | Native type | Required |
| --- | --- | --- |
| client | `any` | Yes |
| product_subscription | `any` | Yes |
| params | `any` | Yes |
| opts | `any` | Yes |

Returns: `any`.

```exs
client = SellApp.Client.new(
  base_url: System.fetch_env!("SELLAPP_API_BASE_URL"),
  customer_session: System.fetch_env!("SELLAPP_CUSTOMER_SESSION"),
  store: ""
)

{:ok, result} = SellApp.CustomerPortal.confirm_customer_subscription_renewal_date_change(client, 42, %{"preview_id" => "preview_01K4"}, idempotency_key: "example-mutation-001")
IO.inspect(result)
```

### Authentication and errors

Supported credential alternatives (each object is one alternative):

```json
[
  {
    "customerSession": []
  }
]
```

Documented HTTP responses: 200, 400, 401, 403, 404, 409, 410, 422, 429, 500. See the API reference for field-level validation and consequences.

[Response access, transport controls, pagination, and typed errors](../usage.md)

