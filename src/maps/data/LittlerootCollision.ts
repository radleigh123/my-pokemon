import { TileMap } from "@/engine/map/TileMap";
import { TileType } from "@/engine/map/TileType";

const T = TileType.Tree;
const F = TileType.Floor;
const B = TileType.Building;
const S = TileType.Sign;
const D = TileType.Door;
const P = TileType.Warp;

const SMALL: TileType[][] = [
  [T, T, T, T, T, T, T, T, T, T, T, T, P, P, T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T, T, T, F, F, T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, F, F, F, F, F, F, F, F, F, F, T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T],
  [T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T],
  [T, T, F, F, B, B, B, B, B, F, F, F, F, F, F, B, B, B, B, B, F, F, T, T],
  [T, T, F, F, B, B, B, B, B, F, F, F, F, F, F, B, B, B, B, B, F, F, T, T],
  [T, T, F, F, B, B, B, B, B, F, F, F, F, F, F, B, B, B, B, B, F, F, T, T],
  [T, T, F, F, B, B, B, D, B, S, F, F, F, F, S, B, D, B, B, B, F, F, T, T],
  [T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T],
  [T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T],
  [T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T],
  [T, T, F, F, F, B, B, B, B, B, B, B, F, F, F, F, F, F, F, F, F, F, T, T],
  [T, T, F, F, F, B, B, B, B, B, B, B, F, F, F, F, F, S, F, F, F, F, T, T],
  [T, T, F, F, F, B, B, B, B, B, B, B, F, F, F, F, F, F, F, F, F, F, T, T],
  [T, T, F, F, F, B, B, B, B, B, B, B, F, F, F, F, F, F, F, F, F, F, T, T],
  [T, T, F, F, F, B, B, B, B, D, B, B, F, F, F, F, F, F, F, F, T, T, T, T],
  [T, T, F, F, F, F, F, F, S, F, F, F, F, F, F, F, F, F, F, F, T, T, T, T],
  [T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T, T, T, T, T],
  [T, T, T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
  [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
];

export function createCollisionGrid(): TileType[][] {
  const grid = TileMap.createFilled(SMALL[0]!.length, SMALL.length, T);

  TileMap.stampTiles(grid, SMALL, 0, 0);

  return grid;
}
