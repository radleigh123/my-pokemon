import { TileType } from "./TileType";

export class TileMap {
  public static readonly TILE_SIZE = 16;

  constructor(
    private readonly image: HTMLImageElement,
    private readonly width: number,
    private readonly height: number,
    private readonly tiles: TileType[][],
  ) {}

  public getImage(): HTMLImageElement {
    return this.image;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getTile(pixelX: number, pixelY: number): TileType {
    const column = Math.floor(pixelX / TileMap.TILE_SIZE);
    const row = Math.floor(pixelY / TileMap.TILE_SIZE);

    if (row < 0 || row >= this.tiles.length || column < 0 || column >= this.tiles[0]!.length) {
      return TileType.Wall;
    }

    return this.tiles[row]![column]!;
  }

  public isBlocked(x: number, y: number, width: number, height: number): boolean {
    const left = Math.floor(x / TileMap.TILE_SIZE);
    const right = Math.floor((x + width - 1) / TileMap.TILE_SIZE);

    const top = Math.floor(y / TileMap.TILE_SIZE);
    const bottom = Math.floor((y + height - 1) / TileMap.TILE_SIZE);

    for (let row = top; row <= bottom; row++) {
      for (let column = left; column <= right; column++) {
        if (row < 0 || row >= this.tiles.length || column < 0 || column >= this.tiles[0]!.length) {
          return true;
        }

        const tile = this.tiles[row]![column];

        if (tile === TileType.Wall) {
          return true;
        }
      }
    }

    return false;
  }
}
