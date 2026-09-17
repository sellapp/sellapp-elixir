# Elixir examples

See the connected workflow source in `catalog.exs`.

The catalog, checkout, and upload workflow helpers change real data when given a live client. Their native documentation tests use fixture transports and dummy credentials. Catalog steps pass the created product ID into retrieval and update; checkout retrieves the order before starting its provider checkout; upload retrieves the file using the returned file ID. Do not retry a lost checkout response without first checking the order. Use a separate client for each store's credentials.


Start with one product, move on to a full page loop, then see how to handle
failures. Each script is complete; you can read it from top to bottom.

Run `mix deps.get` and `mix compile` from the SDK checkout. Set the variables
in [onboarding](../README.md#your-first-request), then run:

```sh
mix run examples/first-request.exs
mix run examples/pagination.exs
mix run examples/errors.exs
```

You may copy these complete scripts into another Mix application with the SDK
installed. They use the public modules and only read data. An explicit
`SELLAPP_API_BASE_URL` is required; missing configuration never selects production.
The error example reports failures if they occur; adapt reporting to your
application's error policy.

To try the checks without contacting your store, run `mix test`. It runs these
exact files against a localhost mock (a local stand-in for the API) with dummy credentials,
checking product fields, an empty store, two-page traversal, and a 401 request ID.
