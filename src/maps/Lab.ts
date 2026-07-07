import { AssetManager } from "@/engine/assets/AssetManager";
import { TileMap } from "@/engine/map/TileMap";

import lab from "@/assets/maps/lab.png";
import { TileType } from "@/engine/map/TileType";

export async function createLab(assets: AssetManager): Promise<TileMap> {
  const image = await assets.loadImage(lab);

  if (image.height % TileMap.TILE_SIZE !== 0) {
    throw new Error(
      `Map height (${image.height}) must be divisible by ${TileMap.TILE_SIZE}.`
    );
  }

  if (image.width % TileMap.TILE_SIZE !== 0) {
    throw new Error(
      `Map width (${image.width}) must be divisible by ${TileMap.TILE_SIZE}.`
    );
  }

  const rows = image.height / TileMap.TILE_SIZE;
  const columns = image.width / TileMap.TILE_SIZE;

  // const columns = Math.ceil(image.width / TileMap.TILE_SIZE);
  // const rows = Math.ceil(image.height / TileMap.TILE_SIZE);

  const tiles = Array.from({ length: rows }, () => Array(columns).fill(TileType.Floor));

  console.log("LAB:", image.width, image.height, rows, columns);

  return new TileMap(image, columns, rows, tiles);
}
