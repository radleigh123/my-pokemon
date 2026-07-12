import { TileMap } from "@/engine/map/TileMap";
import { TileType } from "@/engine/map/TileType";

const W = TileType.Wall;
const F = TileType.Floor;
const P = TileType.Warp;

const SMALL: TileType[][] = [
  [W, W, W, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, W],
  [W, F, W, F, F, F, F, F, F, F, F, F, W],
  [W, F, F, F, F, F, F, F, F, F, W, F, W],
  [F, F, F, F, F, F, W, F, F, W, W, F, W],
  [W, W, W, W, F, F, F, F, F, F, F, F, F],
  [W, W, W, W, F, F, F, F, F, F, W, W, F],
  [W, W, W, W, F, F, F, F, F, F, W, W, W],
  [F, F, F, F, F, F, F, F, F, F, F, F, F],
  [F, W, F, F, F, F, F, F, F, F, F, W, W],
  [W, W, F, F, F, F, F, F, F, F, F, W, W],
  [W, W, F, F, F, F, F, F, F, F, F, W, W],
  [F, F, F, W, F, F, P, P, F, F, F, F, F],
];

export function createCollisionGrid(): TileType[][] {
  const grid = TileMap.createFilled(SMALL[0]!.length, SMALL.length, W);

  TileMap.stampTiles(grid, SMALL, 0, 0);

  return grid;
}
