import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";
import "./models/core.tsp";

using Http;
using Rest;
using FarmVibes.Models;

@service(#{
  title: "FarmVibes.AI REST API"
})
@server("http://localhost:5678/api/v1", "Local development server")
namespace FarmVibesAPI;

@route("/data")
@tag("Data")
interface DataOperations {
  @doc("List DataVibe objects")
  @get
  list(): {
    @statusCode statusCode: 200;
    @body items: DataVibe[];
  } | ErrorResponse;

  @doc("Get a specific DataVibe object")
  @get
  read(@path id: string): {
    @statusCode statusCode: 200;
    @body item: DataVibe;
  } | {
    @statusCode statusCode: 404;
    @body error: ErrorResponse;
  };
}
