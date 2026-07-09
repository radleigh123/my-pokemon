import { AssetManager } from "@/engine/assets/AssetManager";
import { TileMap } from "@/engine/map/TileMap";
import { TileType } from "@/engine/map/TileType";
import { Music } from "@/audio/Music";

// import littleroot from "@/assets/maps/littleroot-512x480px.png";
import littleroot from "@/assets/maps/littleroot-512x480px copy.png";
import type { GameMap } from "@/engine/map/GameMap";
import type { Warp } from "@/engine/map/Warp";
import { MapId } from "@/engine/map/MapManager";
import { createCollisionGrid } from "./data/LittlerootCollision";

export async function createLittleroot(assets: AssetManager): Promise<GameMap> {
  const image = await assets.loadImage(littleroot);

  const columns = image.width / TileMap.TILE_SIZE;
  const rows = image.height / TileMap.TILE_SIZE;

  const warps: Warp[] = [
    {
      column: 13,
      row: 19,

      width: 16,
      height: 5,

      destination: MapId.Lab,

      spawnColumn: 15,
      spawnRow: 21,
    },
  ];

  const tiles = createCollisionGrid();

  const map = new TileMap(image, columns, rows, tiles, Music.LittlerootTown, warps);

  return {
    tileMap: map,
    npcs: [],
  };
}
