directory = System.argv() |> List.first()
snippets = Enum.flat_map(["operation-examples.json", "operation-variants.json"], fn name -> Path.join([directory, "docs", name]) |> File.read!() |> Jason.decode!() end)
errors = Enum.flat_map(Enum.with_index(snippets), fn {snippet, index} ->
  try do
    ast = Code.string_to_quoted!(snippet["content"])
    Macro.prewalk(ast, fn
      {{:., _, [{:__aliases__, _, parts}, name]}, _, args} = node when is_list(args) ->
        module = Module.concat(parts)
        Code.ensure_loaded!(module)
        unless function_exported?(module, name, length(args)), do: raise("Unknown function #{inspect(module)}.#{name}/#{length(args)}")
        node
      node -> node
    end)
    module = Module.concat([SellAppDocumentationCheck, "Example#{index}"])
    Code.compile_quoted(quote do
      defmodule unquote(module) do
        def run do
          unquote(ast)
        end
      end
    end)
    []
  rescue
    error -> ["#{snippet["operationId"]}: #{Exception.message(error)}"]
  end
end)
if errors != [] do
  IO.puts(:stderr, Enum.join(errors, "\n"))
  System.halt(1)
end
IO.puts("Compiled and checked native calls for #{length(snippets)} Elixir examples; no HTTP requests executed.")
