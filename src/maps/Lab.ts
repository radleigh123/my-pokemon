import { AssetManager } from "@/engine/assets/AssetManager";
import { TileMap } from "@/engine/map/TileMap";

import lab from "@/assets/maps/lab.png";
import { TileType } from "@/engine/map/TileType";

export async function createLab(assets: AssetManager): Promise<TileMap> {
  const image = await assets.loadImage(lab);

  console.log(image.width, image.height);

  const rows = Math.ceil(image.height / TileMap.TILE_SIZE);
  const columns = Math.ceil(image.width / TileMap.TILE_SIZE);

  const tiles = Array.from({ length: rows }, () => Array(columns).fill(TileType.Floor));

  return new TileMap(image, image.width, image.height, tiles);
}
