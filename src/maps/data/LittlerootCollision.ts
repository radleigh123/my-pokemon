import { TileMap } from "@/engine/map/TileMap";
import { TileType } from "@/engine/map/TileType";

const W = TileType.Wall;
const F = TileType.Floor;
const G = TileType.Grass;
const O = TileType.Object;
const D = TileType.Door;
const P = TileType.Warp;

export function createCollisionGrid(): TileType[][] {
  const grid = TileMap.createFilled(24, 23, W);

  // Walkable lawn inside the tree border.
  TileMap.fillTiles(grid, 4, 3, 18, 3, G);
  TileMap.fillTiles(grid, 2, 6, 21, 6, G);
  TileMap.fillTiles(grid, 3, 12, 20, 7, G);
  TileMap.fillTiles(grid, 5, 19, 15, 3, G);

  // North exit path to Route 101.
  TileMap.fillTiles(grid, 10, 0, 4, 5, F);

  // Door paths and main walking paths.
  TileMap.fillTiles(grid, 4, 10, 18, 2, F);
  TileMap.fillTiles(grid, 10, 5, 4, 7, F);
  TileMap.fillTiles(grid, 11, 18, 6, 3, F);
  TileMap.fillTiles(grid, 14, 12, 4, 8, F);

  // House bodies and roofs.
  TileMap.fillTiles(grid, 4, 5, 6, 5, O);
  TileMap.fillTiles(grid, 15, 5, 6, 5, O);
  TileMap.fillTiles(grid, 5, 12, 9, 6, O);

  // Door and warp tiles.
  TileMap.fillTiles(grid, 13, 18, 1, 1, D);
  TileMap.fillTiles(grid, 10, 0, 4, 1, P);

  // Sign and small object blockers.
  TileMap.setTileInGrid(grid, 9, 8, O);
  TileMap.setTileInGrid(grid, 14, 8, O);
  TileMap.setTileInGrid(grid, 17, 13, O);
  TileMap.setTileInGrid(grid, 8, 18, O);

  return grid;
}
