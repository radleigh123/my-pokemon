import { TileType } from "@/engine/map/TileType";

const W = TileType.Wall;
const F = TileType.Floor;

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
  [F, F, F, W, F, F, F, F, F, F, F, F, F],
];

export function createCollisionGrid(): TileType[][] {
  const rows = 32;
  const columns = 32;

  const grid = Array.from({ length: rows }, () => Array(columns).fill(TileType.Wall));

  const startColumn = 9;
  const startRow = 10;

  for (let row = 0; row < SMALL.length; row++) {
    for (let column = 0; column < SMALL[row]!.length; column++) {
      grid[startRow + row]![startColumn + column] = SMALL[row]![column]!;
    }
  }

  return grid;
}
