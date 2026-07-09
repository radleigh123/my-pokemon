import type { Music } from "@/audio/Music";
import { TileType } from "./TileType";
import type { Warp } from "./Warp";

export class TileMap {
  public static readonly TILE_SIZE = 16;

  private spawnX = 16;
  private spawnY = 21.2;
  private readonly columns: number;
  private readonly rows: number;

  constructor(
    private readonly image: HTMLImageElement,
    private readonly tiles: TileType[][],
    private readonly music: Music,
    private readonly warps: Warp[] = [],
  ) {
    this.rows = tiles.length;
    this.columns = tiles[0]?.length ?? 0;

    this.validateTilesCoverImage();
    this.validateWarps();
  }

  public getWarps(): readonly Warp[] {
    return this.warps;
  }

  public getWarp(x: number, y: number, width: number, height: number): Warp | undefined {
    for (const warp of this.warps) {
      const warpX = warp.column * TileMap.TILE_SIZE;
      const warpY = warp.row * TileMap.TILE_SIZE;

      if (
        x < warpX + warp.width &&
        x + width > warpX &&
        y < warpY + warp.height &&
        y + height > warpY
      ) {
        return warp;
      }
    }

    return undefined;
  }

  public setSpawn(column: number, row: number): void {
    this.spawnX = column;
    this.spawnY = row;
  }

  public static createFilled(columns: number, rows: number, type: TileType): TileType[][] {
    return Array.from({ length: rows }, () => Array(columns).fill(type));
  }

  public static setTileInGrid(
    grid: TileType[][],
    column: number,
    row: number,
    type: TileType,
  ): void {
    if (row < 0 || row >= grid.length || column < 0 || column >= grid[row]!.length) {
      return;
    }

    grid[row]![column] = type;
  }

  public static fillTiles(
    grid: TileType[][],
    column: number,
    row: number,
    width: number,
    height: number,
    type: TileType,
  ): void {
    for (let y = row; y < row + height; y++) {
      for (let x = column; x < column + width; x++) {
        TileMap.setTileInGrid(grid, x, y, type);
      }
    }
  }

  public static stampTiles(
    grid: TileType[][],
    layout: readonly (readonly TileType[])[],
    column: number,
    row: number,
  ): void {
    for (let y = 0; y < layout.length; y++) {
      for (let x = 0; x < layout[y]!.length; x++) {
        TileMap.setTileInGrid(grid, column + x, row + y, layout[y]![x]!);
      }
    }
  }

  public setTile(column: number, row: number, type: TileType): void {
    if (row < 0 || row >= this.rows || column < 0 || column >= this.columns) {
      return;
    }

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
        this.setTile(x, y, type);
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
    return this.image.width;
  }

  public getPixelHeight(): number {
    return this.image.height;
  }

  public getTile(pixelX: number, pixelY: number): TileType {
    const column = Math.floor(pixelX / TileMap.TILE_SIZE);
    const row = Math.floor(pixelY / TileMap.TILE_SIZE);

    if (row < 0 || row >= this.tiles.length || column < 0 || column >= this.tiles[0]!.length) {
      return TileType.Wall;
    }

    return this.tiles[row]![column]!;
  }

  public isBlockingTile(tile: TileType): boolean {
    return tile === TileType.Wall || tile === TileType.Water || tile === TileType.Object;
  }

  public isBlocked(x: number, y: number, width: number, height: number): boolean {
    if (x < 0 || y < 0 || x + width > this.image.width || y + height > this.image.height) {
      return true;
    }

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

        if (this.isBlockingTile(this.tiles[row]![column]!)) {
          return true;
        }
      }
    }

    return false;
  }

  private validateTilesCoverImage(): void {
    if (this.tiles.length === 0 || this.tiles[0]!.length === 0) {
      throw new Error("TileMap requires a non-empty collision grid.");
    }

    const columns = this.tiles[0]!.length;

    for (const row of this.tiles) {
      if (row.length !== columns) {
        throw new Error("TileMap collision grid rows must all have the same width.");
      }
    }

    const requiredColumns = Math.ceil(this.image.width / TileMap.TILE_SIZE);
    const requiredRows = Math.ceil(this.image.height / TileMap.TILE_SIZE);

    if (columns < requiredColumns || this.tiles.length < requiredRows) {
      throw new Error(
        `TileMap collision grid ${columns}x${this.tiles.length} does not cover image ` +
          `${this.image.width}x${this.image.height}.`,
      );
    }
  }

  private validateWarps(): void {
    for (const warp of this.warps) {
      const x = warp.column * TileMap.TILE_SIZE;
      const y = warp.row * TileMap.TILE_SIZE;

      if (
        x < 0 ||
        y < 0 ||
        warp.width <= 0 ||
        warp.height <= 0 ||
        x + warp.width > this.image.width ||
        y + warp.height > this.image.height
      ) {
        throw new Error(
          `Warp at ${warp.column},${warp.row} (${warp.width}x${warp.height}) ` +
          `does not fit inside image ${this.image.width}x${this.image.height}.`,
        );
      }

      if (this.isBlocked(x, y, warp.width, warp.height)) {
        throw new Error(
          `Warp at ${warp.column},${warp.row} (${warp.width}x${warp.height}) ` +
            "overlaps blocked collision tiles.",
        );
      }
    }
  }
}
