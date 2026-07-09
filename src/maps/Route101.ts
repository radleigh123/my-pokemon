import { Music } from "@/audio/Music";
import { AssetManager } from "@/engine/assets/AssetManager";
import type { GameMap } from "@/engine/map/GameMap";
import { MapId } from "@/engine/map/MapManager";
import { TileMap } from "@/engine/map/TileMap";
import type { Warp } from "@/engine/map/Warp";

import route101 from "@/assets/maps/route101-383x318.png";
import { createCollisionGrid } from "./data/Route101Collision";

export async function createRoute101(assets: AssetManager): Promise<GameMap> {
  const image = await assets.loadImage(route101);

  const warps: Warp[] = [
    {
      column: 10,
      row: 19,
      width: 48,
      height: 14,
      destination: MapId.Littleroot,
      spawnColumn: 12,
      spawnRow: 3,
    },
  ];

  const tiles = createCollisionGrid();
  const map = new TileMap(image, tiles, Music.Route1, warps);
  map.setSpawn(12, 18);

  return {
    tileMap: map,
    npcs: [],
  };
}
