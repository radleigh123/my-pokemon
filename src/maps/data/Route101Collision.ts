import { TileMap } from "@/engine/map/TileMap";
import { TileType } from "@/engine/map/TileType";

const W = TileType.Wall;
const F = TileType.Floor;
const G = TileType.Grass;
const P = TileType.Warp;

export function createCollisionGrid(): TileType[][] {
  const grid = TileMap.createFilled(24, 20, W);

  TileMap.fillTiles(grid, 10, 1, 4, 18, F);
  TileMap.fillTiles(grid, 9, 5, 6, 4, F);
  TileMap.fillTiles(grid, 8, 12, 8, 4, F);

  TileMap.fillTiles(grid, 2, 3, 5, 4, G);
  TileMap.fillTiles(grid, 17, 3, 5, 4, G);
  TileMap.fillTiles(grid, 2, 10, 5, 5, G);
  TileMap.fillTiles(grid, 17, 10, 5, 5, G);
  TileMap.fillTiles(grid, 2, 16, 6, 3, G);
  TileMap.fillTiles(grid, 16, 16, 6, 3, G);

  TileMap.fillTiles(grid, 10, 0, 4, 1, P);
  TileMap.fillTiles(grid, 10, 19, 4, 1, P);

  return grid;
}
