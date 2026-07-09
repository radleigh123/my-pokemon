import { AssetManager } from "@/engine/assets/AssetManager";
import { TileMap } from "@/engine/map/TileMap";
import { TileType } from "@/engine/map/TileType";
import { Music } from "@/audio/Music";

import littleroot from "@/assets/maps/littleroot-512x480px.png";
import type { GameMap } from "@/engine/map/GameMap";
import type { Warp } from "@/engine/map/Warp";
import { MapId } from "@/engine/map/MapManager";

export async function createLittleroot(assets: AssetManager): Promise<GameMap> {
  const image = await assets.loadImage(littleroot);

  const columns = image.width / TileMap.TILE_SIZE;
  const rows = image.height / TileMap.TILE_SIZE;

  const warps: Warp[] = [
    {
      column: 16,
      row: 25,

      width: 16,
      height: 16,

      destination: MapId.Lab,

      spawnColumn: 15,
      spawnRow: 21,
    },
  ];

  const tiles = TileMap.createFilled(columns, rows, TileType.Wall);

  const map = new TileMap(image, columns, rows, tiles, Music.LittlerootTown, warps);

  map.clearRectangle(2, 2, 28, 26);

  map.setSpawn(16, 23);

  return {
    tileMap: map,
    npcs: [],
  };
}
