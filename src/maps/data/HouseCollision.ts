import { TileMap } from "@/engine/map/TileMap";
import { TileType } from "@/engine/map/TileType";

const W = TileType.Wall;
const F = TileType.Floor;
const O = TileType.Object;
const P = TileType.Warp;

const HOUSE1_FLOOR1: TileType[][] = [
  [W, W, W, W, W, W, W, W, W, W, W],
  [O, O, O, O, O, W, W, W, F, W, W],
  [O, O, O, O, O, F, F, W, P, W, W],
  [F, F, F, F, F, F, F, F, F, F, F],
  [F, F, O, O, O, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, O, O, F, F, F, F, F, F],
  [F, F, F, O, O, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, P, P, F],
];

const HOUSE1_FLOOR2: TileType[][] = [
  [W, W, W, W, W, W, W, W, W],
  [O, O, W, O, O, W, W, P, W],
  [F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F],
  [F, O, F, F, F, F, F, F, F],
  [F, O, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F],
];

const HOUSE2_FLOOR1: TileType[][] = [
  [W, W, W, W, W, W, W, W, W, W, W],
  [W, W, F, W, W, W, O, O, O, O, O],
  [W, W, P, W, F, F, O, O, O, O, O],
  [F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, O, O, O, F, F],
  [F, F, F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, O, O, F, F, F],
  [F, F, F, F, F, F, O, O, F, F, F],
  [F, P, P, F, F, F, F, F, F, F, F],
];

const HOUSE2_FLOOR2: TileType[][] = [
  [W, W, W, W, W, W, W, W, W],
  [W, P, W, W, O, O, W, O, O],
  [F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, O, F],
  [F, F, F, F, F, F, F, O, F],
  [F, F, F, F, F, F, F, F, F],
  [F, F, F, F, F, F, F, F, F],
];

function createGrid(layout: TileType[][]): TileType[][] {
  const grid = TileMap.createFilled(layout[0]!.length, layout.length, W);

  TileMap.stampTiles(grid, layout, 0, 0);

  return grid;
}

export function createHouse1Floor1CollisionGrid(): TileType[][] {
  return createGrid(HOUSE1_FLOOR1);
}

export function createHouse1Floor2CollisionGrid(): TileType[][] {
  return createGrid(HOUSE1_FLOOR2);
}

export function createHouse2Floor1CollisionGrid(): TileType[][] {
  return createGrid(HOUSE2_FLOOR1);
}

export function createHouse2Floor2CollisionGrid(): TileType[][] {
  return createGrid(HOUSE2_FLOOR2);
}
