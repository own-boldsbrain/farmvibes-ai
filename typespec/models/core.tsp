import "@typespec/http";
import "@typespec/openapi";

using Http;

namespace FarmVibes.Models;

@doc("A bounding box representing the spatial extent of the data.")
model BBox {
  minx: float64;
  miny: float64;
  maxx: float64;
  maxy: float64;
}

@doc("A time range representing the temporal extent of the data.")
model TimeRange {
  start: utcDateTime;
  end: utcDateTime;
}

@doc("Represents an asset in FarmVibes.AI.")
model AssetVibe {
  id: string;
  path_or_url: string;
  type?: string;
}

@doc("Base representation of a data object in FarmVibes.AI.")
model DataVibe {
  id: string;
  time_range: TimeRange;
  bbox?: BBox;

  // Using Record<unknown> to represent Dict[str, Any] for geometry for now
  geometry: Record<unknown>;

  assets: AssetVibe[];
}

@doc("Error representation for FarmVibes API.")
@error
model ErrorResponse {
  code: int32;
  message: string;
}
