import { TileMap } from "@/engine/map/TileMap";
import type { Door } from "@/entities/Door";
import { NPC } from "@/entities/NPC";

export interface GameMap {
  readonly tileMap: TileMap;
  readonly npcs: NPC[];
  door?: Door;
}
