import { TileMap } from "@/engine/map/TileMap";
import { TileType } from "@/engine/map/TileType";

const W = TileType.Wall;
const F = TileType.Floor;
const G = TileType.Grass;
const O = TileType.Object;
const D = TileType.Door;
const P = TileType.Warp;

const SMALL: TileType[][] = [
  [W, W, W, W, W, W, W, W, W, W, P, P, P, P, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, F, F, F, F, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, F, F, F, F, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, G, G, G, G, G, G, F, F, F, F, G, G, G, G, G, G, G, G, W, W],
  [W, W, W, W, G, G, G, G, G, G, F, F, F, F, G, G, G, G, G, G, G, G, W, W],
  [W, W, W, W, O, O, O, O, O, O, F, F, F, F, G, O, O, O, O, O, O, G, W, W],
  [W, W, G, G, O, O, O, O, O, O, F, F, F, F, G, O, O, O, O, O, O, G, G, W],
  [W, W, G, G, O, O, O, O, O, O, F, F, F, F, G, O, O, O, O, O, O, G, G, W],
  [W, W, G, G, O, O, O, O, O, O, F, F, F, F, O, O, O, O, O, O, O, G, G, W],
  [W, W, G, G, O, O, O, O, O, O, F, F, F, F, G, O, O, O, O, O, O, G, G, W],
  [W, W, G, G, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, G, W],
  [W, W, G, G, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, G, W],
  [W, W, W, G, G, O, O, O, O, O, O, O, O, O, F, F, F, F, G, G, G, G, G, W],
  [W, W, W, G, G, O, O, O, O, O, O, O, O, O, F, F, F, O, G, G, G, G, G, W],
  [W, W, W, G, G, O, O, O, O, O, O, O, O, O, F, F, F, F, G, G, G, G, G, W],
  [W, W, W, G, G, O, O, O, O, O, O, O, O, O, F, F, F, F, G, G, G, G, G, W],
  [W, W, W, G, G, O, O, O, O, O, O, O, O, O, F, F, F, F, G, G, G, G, G, W],
  [W, W, W, G, G, O, O, O, O, O, O, O, O, O, F, F, F, F, G, G, G, G, G, W],
  [W, W, W, G, G, G, G, G, O, G, G, F, F, D, F, F, F, F, G, G, G, G, G, W],
  [W, W, W, W, W, G, G, G, G, G, G, F, F, F, F, F, F, F, G, G, W, W, W, W],
  [W, W, W, W, W, G, G, G, G, G, G, F, F, F, F, F, F, G, G, G, W, W, W, W],
  [W, W, W, W, W, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
];

export function createCollisionGrid(): TileType[][] {
  const grid = TileMap.createFilled(SMALL[0]!.length, SMALL.length, W);

  TileMap.stampTiles(grid, SMALL, 0, 0);

  return grid;
}
