# Move to the current SellApp API contract

This update covers 433 SDK operations. Existing API-key constructors remain available. Review the changes below before rebuilding your integration.

## Convenience operations and atomic creation

Seven additional operations retain these language-neutral identities. Check the generated method index for your language's native spelling.

| Operation ID                    | CLI command                          |
| ------------------------------- | ------------------------------------ |
| `listWalletTransactions`        | `wallet transactions list`           |
| `listCreditBalanceTransactions` | `credits balances transactions list` |
| `upsertCustomerByExternalId`    | `customers upsert-by-external-id`    |
| `syncGroupProducts`             | `groups products replace`            |
| `updateTicket`                  | `tickets update`                     |
| `createWalletOrder`             | `orders create-from-wallet`          |
| `payOrderFromWallet`            | `orders pay-from-wallet`             |

Product creation accepts initial variants and bundle contents atomically. Add-on creation accepts its initial variant; the existing `createAddOnDraft` identity is retained even when that request publishes the add-on. These creation fields are absent from update and batch requests. Group updates can change section and ordered membership; the dedicated membership replacement accepts `product_ids`, including `[]` to clear membership. Group updates and replacement require the CLI/MCP consequential-action confirmation.

Wallet history is paginated. Wallet spending requires both invoice and wallet-write abilities, full available funds, and a stable idempotency key. A paid order may still await fulfillment. Customer upsert requires email; omitted fields stay unchanged, while supplied metadata replaces the complete metadata object.

Custom-payment modifiers now have typed nullable object models. Omit `modifier` to preserve it on update; send `null` or `{}` to clear it. Go callers use `NullFields: []string{"modifier"}` for explicit null. Named nullable objects now retain their declared fields and nullability across all languages instead of falling back to empty model shapes. Recompile integrations that constructed those models directly; component identities remain stable, but declared required fields and value types are now enforced. Decimal modifier inputs remain strings or numbers. Custom wallet top-ups do not apply these adjustments.

The hosted MCP runtime remains the business executor. Compact mode is the default; catalog mode is optional. Resource and discovery cache hints do not authorize caching REST business data in an SDK. Selected REST reads are cached by the server; send the standard `Cache-Control: no-cache` or `no-store` header when a bypass is needed.

## Shared account operations

User-owned API keys now support identity, store discovery and permission inspection
with `account:read`, and store creation with `stores:create`. Existing keys are
unchanged; a `*` key satisfies the new abilities subject to the same membership,
role and optional selected-store restrictions. Selected-store keys cannot create
stores. Account identity, discovery, detail by ID and creation omit `X-STORE`;
permission inspection and store business calls select a store explicitly.

These operation identities and resource groups changed together. Use your SDK's
generated method index for its language-specific spelling; no legacy aliases are
provided in this source candidate.

| Previous operation ID  | Current operation ID  | Resource |
| ---------------------- | --------------------- | -------- |
| `getOAuthUser`         | `getAccount`          | Account  |
| `listOAuthStores`      | `listStores`          | Account  |
| `getOAuthStore`        | `getStore`            | Account  |
| `listOAuthPermissions` | `getStorePermissions` | Account  |

`createStore` also belongs to Account. It requires an `Idempotency-Key`; repeat
the same key and body after a lost response within the 24-hour retention period.
Authorized retries share the same user and operation identity across credential
rotation and supported credential types. Current authorization is checked before
replay. Creation returns the ID and slug without changing dashboard selection.
New creation is limited to one store per user every 60 seconds across credentials.
On `429`, honor `Retry-After` and retain the original key and body.

Permission inspection identifies `credential_type`. API-key responses include
`key_abilities`, `store_access` (`all` or `selected`), `store_permissions` and
`effective_abilities`. OAuth responses retain `approved_scopes`, `token_scopes`,
`store_permissions` and `effective_scopes`. These describe authorization; they do
not establish whether a record, provider or payment is eligible for an action.

## Orders method names

This source candidate also carries the existing Orders resource naming update.
Where a language previously repeated `Order` in a method name, use its generated
method index to update these calls. The operation IDs and routes stay the same.

| Previous method name (camel case)   | Current method name (camel case) |
| ----------------------------------- | -------------------------------- |
| `createOrder`                       | `create`                         |
| `createOrderCheckout`               | `createCheckout`                 |
| `createOrderRefund`                 | `createRefund`                   |
| `createOrderReplacement`            | `createReplacement`              |
| `updateOrderStatus`                 | `updateStatus`                   |
| `listOrderDeliverables`             | `listDeliverables`               |
| `retryOrderFulfillment`             | `retryFulfillment`               |
| `retryOrderDynamicDelivery`         | `retryDynamicDelivery`           |
| `sendOrderFulfillmentNotifications` | `sendFulfillmentNotifications`   |

## Removed methods

Remove calls to these routes. They have no replacement SDK method:

- `GET /v2/analytics`
- `GET /v2/seller-balance`
- `GET /v2/seller-payouts` and `POST /v2/seller-payouts`
- `GET /v2/seller-payouts/configuration` and `PUT /v2/seller-payouts/configuration`
- `GET /v2/seller-payouts/{sellerPayout}`
- `PATCH /v2/seller-payouts/{sellerPayout}/status`

The CLI analytics-snapshot workflow is removed. Affiliate payout records remain supported; creating a record does not transfer seller funds. Customer credits, refunds and disputes remain available under their documented contracts.

Catalog plan/create/read/apply routes are absent. Use the individual catalog APIs and check each result. Separate catalog requests are not an atomic transaction; the creation and membership operations above document their own atomic behavior.

## Rebuild model references

The canonical schema names no longer contain repeated `SdkSdk...` prefixes. Regenerate imports and let your compiler identify old model references. For example, the OpenAPI component `SdkSdkActivateLicenseKeyResponseValue200ApplicationJsonPropertyData` is now `ActivateLicenseKeyResponseValue200ApplicationJsonPropertyData`. Each language applies its normal naming rules to these component names.

Retained operation IDs outside the account renames above, including Invoice operation IDs, are unchanged. Retained v2 Invoice request and success-response wire schemas are unchanged after resolving component references; their generated model names can still change.

The new v2 feedback and ticket APIs differ from v1. Existing v1 feedback still uses integer `listing_id` and `invoice_id`; new v2 feedback uses `product_id` and `order_id`. Existing v1 tickets keep string-array references and integer `read_by`; the new v2 ticket types and boolean read status have their own contract. Customer sessions and OAuth permissions are new surfaces. Do not substitute v1 models when calling these v2 methods.

| Resource | Retained v1 fields                           | New v2 fields                                                                                                                |
| -------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Feedback | `listing_id: integer`, `invoice_id: integer` | `product_id: integer\|null`, `order_id: integer\|null`                                                                       |
| Tickets  | `reference: string[]`, `read_by: integer`    | `reference: {type: "product"\|"order"\|null, id: integer\|string\|null}`, `read_status: {customer: boolean, store: boolean}` |

Ticket `archived` remains an integer. Customer-session creation returns a UUID string in `data.id`; pass that returned ID to `DELETE /v2/customer-sessions/{session}`. OAuth permission inspection returns four required string arrays: `store_permissions`, `approved_scopes`, `token_scopes`, and `effective_scopes`.

## Choose credentials for each operation

Supported v2 business operations accept an API key or an OAuth access token. OAuth business calls require `X-STORE`; API-key calls may omit it where the operation permits. Legacy operations retain their own requirements. Customer portal calls require a separate customer-session token and must not receive seller credentials.

OAuth installation management continues to require official CLI OAuth. Ordinary SDK and REST integrations use API keys. Retained OAuth protocol interfaces are official CLI infrastructure, not general-purpose OAuth application onboarding. Protocol requests use the SellApp origin, while business requests use `/api`. Token and revoke requests are form encoded. Protocol discovery and authorization-start requests require no seller credential.

The CLI manages its standard `admin` scope request through `sellapp login` and browser consent. Direct MCP uses its own browser OAuth connection, and the CLI bridge retains its saved OAuth profile. Current membership, role permissions, reviewed operations, token purpose and active installation constrain access. API-key restrictions do not change OAuth consent.

## Handle retries and follow-up work

Customer-session creation returns credentials once, with a 15-minute lifetime. Do not retry it as a way to recover a lost token. An OAuth refresh token rotates when used: serialize refreshes, replace the complete token pair together, and reauthorize after an uncertain exchange instead of replaying a possibly consumed refresh token.

For a business request whose contract supports an idempotency key, keep the same key and body across a retry, including after refreshing the access token. Retain the request ID when investigating an error.

Events use ordinary cursor polling and `meta.next_cursor`. Empty pages are normal. Save your checkpoint only after processing the page successfully. Cursors are bound to the store and filters; `410 cursor_expired` requires a recovery decision. Events are retained for 30 days. Only `order.completed` guarantees detailed event data; other events can require retrieving the referenced resource.

Exports support sales, tax, customers and affiliate payouts in CSV or JSON. Date ranges cover at most 366 inclusive days, defaulting to today and the previous 365 days. One job per store and two per account may be queued or running. Limits are 10,000 source rows, 5 MiB serialized source data, and 10 MiB output; use a smaller date range after a size-limit failure. Follow `poll_after_seconds` and inspect the current state before downloading or retrying a failed export. The authenticated download returns a redirect to short-lived storage. Never send SellApp credentials or `X-STORE` to that storage URL.

Webhook replay creates a new delivery ID for the same integration event. It does not repeat the business mutation and accepts no caller URL, payload or query override. Keep the required idempotency key.
