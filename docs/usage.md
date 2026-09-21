# Elixir usage details

[Back to onboarding](../README.md)

Once you can read one product, fetching the rest looks like the natural next
step. Start here for that loop, then check how errors and retries reach your app.

## Pagination

`:limit` is the number of products you ask for at once; `:page` is the page
number. Fetching successive pages is called pagination.

Product listings accept a parameter map with `:limit` (1–100; API default 15)
and numeric `:page` values (API default 1). Response `meta` and `links`
maps keep string wire keys. [pagination.exs](../examples/pagination.exs) stops at
`meta["last_page"]`, or a 100-page budget. It raises any failed
request rather than returning an incomplete catalog as though it were complete.

`Page.next/1` validates same-origin, same-operation links and extracts a positive
numeric page. `Page.stream/2` applies page/item budgets, detects cycles, walks
empty intermediate pages, and raises any later request error.

## Errors and response data

Use the result tuple to choose what your app does next: `:ok` for a response
you can use, `:error` for a failure you need to handle.

Authentication failures return `{:error, %SellApp.Error.Authentication{}}`;
other API failures return `{:error, %SellApp.Error.Api{}}` with `type`, `code`,
`message`, `status`, `param`, `request_id`, and `docs_url`.
The request ID comes from the body or `X-Request-ID` and may be nil.
Pass `with_response: true` to receive a `SellApp.Response` envelope containing
the typed value, status, headers, and request ID.
Other returned error structs are `Error.Configuration`, `Error.Timeout`,
`Error.Transport`, and `Error.Serialization`. Model validation can raise
`ArgumentError` rather than return an error tuple. Use `case` when a request
may fail; `{:ok, result} = …` is an intentional assertion in the first example.
Keep secrets out of logs.

## Retries, timeouts, and writes

Retries send the request again after a failure. The SDK forces Req's own retry
option off, leaving one predictable retry layer.

The SDK loop makes up to three additional attempts for HTTP 408, 409, 429 and
retryable 5xx/transport failures. GET, HEAD, OPTIONS, PUT, and DELETE are safe
to replay; other methods require spec-declared idempotency support and one
stable nonblank key. Bounded exponential backoff includes jitter and honors
numeric or HTTP-date `Retry-After`. Set `max_retries: 0` for no retries. The
`:timeout` value controls receive timeout
per Req request, not the overall call or connection establishment.

Per-request keyword options include `:timeout`, `:max_retries`, `:headers`,
and `:idempotency_key`. Disable retries for writes that must not repeat.
An idempotency key identifies one intended change so a supporting endpoint can
recognize repeated attempts. Where an endpoint supports idempotency, supply one
explicit stable key for all attempts at the same intended change. The SDK does
not generate keys. A header does not
make an arbitrary endpoint idempotent.

See [API idempotency](https://sell.app/docs/api/idempotency) and
[API errors](https://sell.app/docs/api/errors). No sandbox service is selected by the SDK.

## Client configuration

The environment handles credentials for the first request. For settings specific
to your app, pass keyword options to `SellApp.client/1` or `SellApp.Client.new/1`.
Explicit non-nil credentials override environment values. Missing credentials
return a configuration error before an authenticated request is sent.
The client sends the key in `Authorization: Bearer …` and the store in `X-STORE`.

| Option | Default | Meaning |
| --- | --- | --- |
| `:api_key` | `SELLAPP_API_KEY` | Secret key without the Bearer prefix |
| `:store` | `SELLAPP_STORE` | Store slug |
| `:base_url` | `https://sell.app/api` | API base including `/api` |
| `:timeout` | `60_000` | Req receive timeout, milliseconds |
| `:max_retries` | `3` | Additional SDK attempts; `0` disables retries |
| `:req_options` | `[]` | Additional Req options |

There is no timeout environment override. Resource functions take the client
first, a parameter map where needed, and request options last. Calls run in the
calling process; there is no separate SDK client process to stop.

## Pages and failures

More products? The API returns a page at a time. The
[pagination example](https://github.com/sellapp/sellapp-elixir/blob/v0.1.1/examples/pagination.exs) asks for numbered pages, checks
every result, and stops at a defined limit.

Generated pages support `Page.next/1` and bounded `Page.stream/2`. They
extract positive numeric page values only after validating the configured API
origin and operation path, detect cycles, continue through empty intermediate
pages, and raise later-page failures instead of returning an incomplete list.

When a request fails, the [error example](https://github.com/sellapp/sellapp-elixir/blob/v0.1.1/examples/errors.exs) matches API,
timeout, and transport errors separately and reports the API request ID.
Check the key for a 401, permissions for a 403, and the store slug or resource
ID for a 404.

The SDK disables Req's independent retry loop, so `max_retries` is the single
attempt budget. Read [the retry rules](https://github.com/sellapp/sellapp-elixir/blob/main/docs/usage.md#retries-timeouts-and-writes)
before making writes.
