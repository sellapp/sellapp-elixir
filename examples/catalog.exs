defmodule SellApp.Examples.Catalog do
  # These operations change real catalog data when used outside fixture tests.
  def run(client) do
    with {:ok, created} <-
           SellApp.Products.create(client, %{
             title: "Design kit",
             description: "Templates for your next project.",
             visibility: "HIDDEN"
           }),
         {:ok, product} <- SellApp.Products.get(client, to_string(created.data.id)),
         {:ok, updated} <-
           SellApp.Products.update(client, to_string(product.data.id), %{
             title: "Design kit revised"
           }) do
      {:ok, updated.data.id}
    end
  end

  # Starts provider checkout. Read current order state before retrying a lost response.
  def checkout(client, order_id) do
    with {:ok, order} <- SellApp.Orders.get(client, order_id),
         {:ok, checkout} <- SellApp.Orders.create_checkout(client, to_string(order.data.id), %{}) do
      {:ok, checkout.data.id}
    end
  end

  def upload(client, product_id, variant_id, bytes) do
    with {:ok, uploaded} <-
           SellApp.VariantDeliverableFiles.upload(client, product_id, variant_id, %{file: bytes}),
         {:ok, saved} <-
           SellApp.VariantDeliverableFiles.get(
             client,
             product_id,
             variant_id,
             to_string(uploaded.data.id)
           ) do
      {:ok, saved.data.id}
    end
  end
end
