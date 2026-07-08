import { AssetManager } from "@/engine/assets/AssetManager";
import { TileMap } from "@/engine/map/TileMap";

import lab from "@/assets/maps/lab.png";
import { LAB_COLLISION } from "./data/LabCollision";
import { Music } from "@/audio/Music";

export async function createLab(assets: AssetManager): Promise<TileMap> {
  const image = await assets.loadImage(lab);

  if (image.height % TileMap.TILE_SIZE !== 0) {
    throw new Error(`Map height (${image.height}) must be divisible by ${TileMap.TILE_SIZE}.`);
  }

  if (image.width % TileMap.TILE_SIZE !== 0) {
    throw new Error(`Map width (${image.width}) must be divisible by ${TileMap.TILE_SIZE}.`);
  }

  const rows = image.height / TileMap.TILE_SIZE;
  const columns = image.width / TileMap.TILE_SIZE;

  // const columns = Math.ceil(image.width / TileMap.TILE_SIZE);
  // const rows = Math.ceil(image.height / TileMap.TILE_SIZE);

  console.log("LAB:", image.width, image.height, rows, columns);

  return new TileMap(image, columns, rows, LAB_COLLISION, Music.Lab);
}
