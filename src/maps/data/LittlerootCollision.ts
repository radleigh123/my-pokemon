import { TileType } from "@/engine/map/TileType";

export function createCollisionGrid(): TileType[][] {
  return Array.from({ length: 30 }, () => Array(32).fill(TileType.Wall));
}
