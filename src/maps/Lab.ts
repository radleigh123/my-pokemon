import { AssetManager } from "@/engine/assets/AssetManager";
import { TileMap } from "@/engine/map/TileMap";

import lab from "@/assets/maps/lab.png";

export async function createLab(assets: AssetManager): Promise<TileMap> {
  const image = await assets.loadImage(lab);

  return new TileMap(image, 209, 208);
}
