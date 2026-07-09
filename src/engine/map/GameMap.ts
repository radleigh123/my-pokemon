import { TileMap } from "@/engine/map/TileMap";
import type { MapObject } from "@/engine/map/MapObject";
import type { Door } from "@/entities/Door";
import { NPC } from "@/entities/NPC";

export interface GameMap {
  readonly tileMap: TileMap;
  readonly npcs: NPC[];
  readonly objects?: MapObject[];
  door?: Door;
}
