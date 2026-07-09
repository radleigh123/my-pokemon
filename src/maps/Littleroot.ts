import { AssetManager } from "@/engine/assets/AssetManager";
import { TileMap } from "@/engine/map/TileMap";
import { TileType } from "@/engine/map/TileType";
import { Music } from "@/audio/Music";

import littleroot from "@/assets/maps/littleroot-512x480px.png";
import type { GameMap } from "@/engine/map/GameMap";

export async function createLittleroot(assets: AssetManager): Promise<GameMap> {
  const image = await assets.loadImage(littleroot);

  const columns = image.width / TileMap.TILE_SIZE;
  const rows = image.height / TileMap.TILE_SIZE;

  const tiles = TileMap.createFilled(columns, rows, TileType.Wall);

  const map = new TileMap(image, columns, rows, tiles, Music.LittlerootTown);

  map.clearRectangle(2, 2, 28, 26);

  map.setSpawn(16, 23);

  return {
    tileMap: map,
    npcs: [],
  };
}
