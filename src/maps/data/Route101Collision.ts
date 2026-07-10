import { TileMap } from "@/engine/map/TileMap";
import { TileType } from "@/engine/map/TileType";

const W = TileType.Wall;
const F = TileType.Floor;
const G = TileType.Grass;
const P = TileType.Warp;
const O = TileType.Object;
const C = TileType.Cliff;

const SMALL: TileType[][] = [
  [W, W, W, W, W, W, W, W, W, W, F, F, F, F, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, F, F, F, F, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, G, G, G, F, F, F, F, F, F, F, F, G, G, G, W, W, W, W, W, W],
  [W, W, W, W, G, G, G, G, F, F, F, F, F, F, G, G, G, G, W, W, W, W, W, W],
  [W, W, G, G, G, G, G, G, F, F, F, F, F, F, G, G, G, G, G, G, W, W, W, W],
  [W, W, G, G, G, G, G, F, F, F, F, F, F, F, G, G, G, G, G, G, W, W, W, W],
  [W, W, W, W, G, G, F, F, F, C, C, C, C, W, W, G, G, G, G, F, F, F, W, W],
  [W, W, W, W, C, C, C, C, C, F, F, F, F, W, W, W, W, F, F, F, F, F, W, W],
  [W, W, W, W, F, F, F, F, F, F, F, F, F, W, W, W, W, F, F, F, F, F, W, W],
  [W, W, W, W, W, W, F, O, F, F, F, F, F, W, W, G, G, F, F, F, F, F, W, W],
  [W, W, W, W, W, W, F, F, F, F, F, F, F, G, G, G, G, G, F, F, F, F, W, W],
  [W, W, W, W, W, W, F, F, F, F, F, F, F, G, G, G, G, G, G, F, F, F, W, W],
  [W, W, W, W, W, W, F, F, F, F, F, F, F, G, G, G, G, G, G, F, F, F, W, W],
  [W, W, W, W, G, G, F, F, F, F, C, C, C, C, G, G, G, G, G, F, F, F, W, W],
  [W, W, G, G, G, G, G, F, F, F, F, F, F, F, W, W, G, G, F, F, W, W, W, W],
  [W, W, G, G, G, G, G, G, F, F, F, F, F, F, W, W, G, G, F, F, W, W, W, W],
  [W, W, W, W, G, G, G, G, F, F, F, F, F, F, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, G, G, G, F, F, F, F, F, F, F, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, F, F, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, P, P, W, W, W, W, W, W, W, W, W, W],
];

export function createCollisionGrid(): TileType[][] {
  const grid = TileMap.createFilled(SMALL[0]!.length, SMALL.length, W);

  TileMap.stampTiles(grid, SMALL, 0, 0);

  return grid;
}
