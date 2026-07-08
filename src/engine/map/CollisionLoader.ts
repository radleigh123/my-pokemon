import { TileMap } from "./TileMap";
import { TileType } from "./TileType";

export class CollisionLoader {

  public static load(
    image: HTMLImageElement,
  ): TileType[][] {

    const canvas = document.createElement("canvas");

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(image, 0, 0);

    const rows = image.height / TileMap.TILE_SIZE;
    const columns = image.width / TileMap.TILE_SIZE;

    const tiles: TileType[][] = [];

    for (let row = 0; row < rows; row++) {

      tiles[row] = [];

      for (let column = 0; column < columns; column++) {

        const pixel = ctx.getImageData(
          column * TileMap.TILE_SIZE,
          row * TileMap.TILE_SIZE,
          1,
          1,
        ).data;

        const blocked =
          pixel[0] === 0 &&
          pixel[1] === 0 &&
          pixel[2] === 0;

        tiles[row]![column] =
          blocked
            ? TileType.Wall
            : TileType.Floor;
      }
    }

    return tiles;
  }
}
