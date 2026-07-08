import { AssetManager } from "@/engine/assets/AssetManager";
import { TileMap } from "@/engine/map/TileMap";
import collision from "@/assets/maps/lab-512x512px_collision.png"

// import lab from "@/assets/maps/lab.png";
import lab from "@/assets/maps/lab-512x512px.png";
import { Music } from "@/audio/Music";
import { CollisionLoader } from "@/engine/map/CollisionLoader";

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

  /* const tiles = Array.from(
    { length: rows },
    () => Array(columns).fill(TileType.Floor)
  ) */
  const collisionImage = await assets.loadImage(collision)

  const tiles = CollisionLoader.load(collisionImage)

  console.log("LAB:", image.width, image.height, rows, columns);

  return new TileMap(image, columns, rows, tiles, Music.Lab);
}
