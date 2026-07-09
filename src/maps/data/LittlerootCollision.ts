import { TileMap } from "@/engine/map/TileMap";
import { TileType } from "@/engine/map/TileType";

const W = TileType.Wall;
const F = TileType.Floor;

const SMALL: TileType[][] = [
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, F, F, W, W, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, F, F, W, W, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, F, F, W, W, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W, W, W, W, W, W],
  [W, W, W, W, W, W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W, W, W, W, W, W],
  [W, W, W, W, F, F, F, W, W, W, F, F, F, F, F, F, F, F, W, W, W, F, F, F, W, W, W, W],
  [W, W, W, W, F, F, W, W, W, W, W, F, F, F, F, F, F, W, W, W, W, W, F, F, W, W, W, W],
  [W, W, W, W, F, F, W, W, W, W, W, F, F, F, F, F, F, W, W, W, W, W, F, F, W, W, W, W],
  [W, W, W, W, F, F, W, W, W, W, W, F, F, F, F, F, F, W, W, W, W, W, F, F, W, W, W, W],
  [W, W, W, W, F, F, W, W, W, W, W, W, F, F, F, F, W, W, W, W, W, W, F, F, W, W, W, W],
  [W, W, W, W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W, W, W, W],
  [W, W, W, W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W, W, W, W],
  [W, W, W, W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W, W, W, W],
  [W, W, W, W, F, F, F, W, W, W, W, W, W, W, F, F, F, F, F, F, F, F, F, F, W, W, W, W],
  [W, W, W, W, F, F, F, W, W, W, W, W, W, W, F, F, F, F, F, W, F, F, F, F, W, W, W, W],
  [W, W, W, W, F, F, F, W, W, W, W, W, W, W, F, F, F, F, F, F, F, F, F, F, W, W, W, W],
  [W, W, W, W, F, F, F, W, W, W, W, W, W, W, F, F, F, F, F, F, F, F, F, F, W, W, W, W],
  [W, W, W, W, F, F, F, W, W, W, W, W, W, W, F, F, F, F, F, F, F, F, W, W, W, W, W, W],
  [W, W, W, W, F, F, F, F, F, F, W, F, F, F, F, F, F, F, F, F, F, F, W, W, W, W, W, W],
  [W, W, W, W, W, W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
];

export function createCollisionGrid(): TileType[][] {
  const grid = TileMap.createFilled(32, 30, TileType.Wall);

  const startColumn = 2;
  const startRow = 0;

  for (let row = 0; row < SMALL.length; row++) {
    for (let column = 0; column < SMALL[row]!.length; column++) {
      grid[startRow + row]![startColumn + column] = SMALL[row]![column]!;
    }
  }

  return grid;
}
