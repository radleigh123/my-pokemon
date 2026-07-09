import type { Music } from "@/audio/Music";
import { TileType } from "./TileType";

export class TileMap {
  public static readonly TILE_SIZE = 16;

  private spawnX = 15.5;
  private spawnY = 17.9;

  constructor(
    private readonly image: HTMLImageElement,
    private readonly columns: number,
    private readonly rows: number,
    private readonly tiles: TileType[][],
    private readonly music: Music,
  ) {}

  public static createFilled(columns: number, rows: number, type: TileType): TileType[][] {
    return Array.from({ length: rows }, () => Array(columns).fill(type));
  }

  public setTile(column: number, row: number, type: TileType): void {
    this.tiles[row]![column] = type;
  }

  public fillRectangle(
    column: number,
    row: number,
    width: number,
    height: number,
    type: TileType,
  ): void {
    for (let y = row; y < row + height; y++) {
      for (let x = column; x < column + width; x++) {
        if (x < 0 || x >= this.columns || y < 0 || y >= this.rows) {
          continue;
        }

        this.tiles[y]![x] = type;
      }
    }
  }

  public clearRectangle(column: number, row: number, width: number, height: number): void {
    this.fillRectangle(column, row, width, height, TileType.Floor);
  }

  public getMusic(): Music {
    return this.music;
  }

  public getSpawnX(): number {
    return this.spawnX;
  }

  public getSpawnY(): number {
    return this.spawnY;
  }

  public getImage(): HTMLImageElement {
    return this.image;
  }

  public getColumns(): number {
    return this.columns;
  }

  public getRows(): number {
    return this.rows;
  }

  public getPixelWidth(): number {
    return this.columns * TileMap.TILE_SIZE;
  }

  public getPixelHeight(): number {
    return this.rows * TileMap.TILE_SIZE;
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
        if (row < 0 || row >= this.rows) {
          return true;
        }

        if (column < 0 || column >= this.columns) {
          return true;
        }

        if (this.tiles[row]![column] === TileType.Wall) {
          return true;
        }
      }
    }

    return false;
  }
}
