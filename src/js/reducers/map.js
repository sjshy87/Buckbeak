import "proj4";
import "proj4leaflet";
import L from "leaflet";
import {
  ADD_BASELAYER,
  ADD_OVERLAY,
  REMOVE_BASELAYER,
  REMOVE_OVERLAY
} from "../actions/map";

const pixel_ratio = parseInt(window.devicePixelRatio) || 1;

const max_zoom = 16;
const tile_size = 512;

const extent = Math.sqrt(2) * 6371007.2;
const resolutions = Array(max_zoom + 1)
  .fill()
  .map((_, i) => extent / tile_size / Math.pow(2, i - 1));

console.log(new L.Proj.CRS("GOOGLE"));
const polar = new L.Proj.CRS(
  "EPSG:3575",
  "+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
  {
    origin: [-extent, extent],
    projectedBounds: L.bounds(
      L.point(-extent, extent),
      L.point(extent, -extent)
    ),
    resolutions: resolutions
  }
);
console.log(new L.Proj.CRS("GOOGLE"));
const projections = [
  {
    name: "Web Mercator",
    projection: "EPSG:3857",
    crs: L.CRS.EPSG3857,
    settings: { center: [0, 0], minZoom: 2, maxZoom: 16 }
  },
  {
    name: "Arctic LAEA on 10°E",
    projection: "ESPG:3575",
    crs: polar,
    settings: { center: [87, 87], minZoom: 2, maxZoom: 16 }
  }
];
let baseLayers = [
  {
    name: "Night",
    projection: "EPSG:3857",
    settings: {
      tileSize: 512,
      zoomOffset: -1,
      url:
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
    }
  },
  {
    name: "Polar",
    projection: "ESPG:3575",
    settings: {
      tileSize: 512,
      url: "https://tile.gbif.org/3575/omt/{z}/{x}/{y}@{r}x.png?style=gbif-classic".replace(
        "{r}",
        pixel_ratio
      )
    }
  }
];
let overlays = [];

const initialState = {
  baseLayers,
  center: projections[0].settings.center,
  crs: projections[0],
  layer: baseLayers[0],
  overlays,
  projections,
  zoom: 5
};
export default function map(state = initialState, action) {
  /* TODO: Implement above actions */
  switch (action.type) {
    case ADD_BASELAYER:
      return state;
    case ADD_OVERLAY:
      return state;
    case REMOVE_BASELAYER:
      return state;
    case REMOVE_OVERLAY:
      return state;
    default:
      return state;
  }
}
