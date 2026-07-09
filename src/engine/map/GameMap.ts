import { TileMap } from "@/engine/map/TileMap";
import { NPC } from "@/entities/NPC";

export interface GameMap {
  readonly tileMap: TileMap;
  readonly npcs: NPC[];
}
