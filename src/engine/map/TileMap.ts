import type { Music } from "@/audio/Music";
import { TileType } from "./TileType";
import type { Warp } from "./Warp";

interface TileMapOptions {
  readonly collisionWidth?: number;
  readonly collisionHeight?: number;
  readonly collisionOffsetX?: number;
  readonly collisionOffsetY?: number;
}

export class TileMap {
  public static readonly TILE_SIZE = 16;

  private spawnX = 16;
  private spawnY = 21.2;
  private readonly columns: number;
  private readonly rows: number;
  private readonly collisionWidth: number;
  private readonly collisionHeight: number;
  private readonly collisionOffsetX: number;
  private readonly collisionOffsetY: number;

  constructor(
    private readonly image: HTMLImageElement,
    private readonly tiles: TileType[][],
    private readonly music: Music,
    private readonly warps: Warp[] = [],
    options: TileMapOptions = {},
  ) {
    this.rows = tiles.length;
    this.columns = tiles[0]?.length ?? 0;
    this.collisionWidth = options.collisionWidth ?? image.width;
    this.collisionHeight = options.collisionHeight ?? image.height;
    this.collisionOffsetX = options.collisionOffsetX ?? 0;
    this.collisionOffsetY = options.collisionOffsetY ?? 0;

    this.validateTilesCoverImage();
    this.validateCollisionBounds();
    this.validateWarps();
  }

  public getWarps(): readonly Warp[] {
    return this.warps;
  }

  public getWarp(x: number, y: number, width: number, height: number): Warp | undefined {
    for (const warp of this.warps) {
      const warpX = this.getTilePixelX(warp.column);
      const warpY = this.getTilePixelY(warp.row);

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

  public getCollisionWidth(): number {
    return this.collisionWidth;
  }

  public getCollisionHeight(): number {
    return this.collisionHeight;
  }

  public getCollisionOffsetX(): number {
    return this.collisionOffsetX;
  }

  public getCollisionOffsetY(): number {
    return this.collisionOffsetY;
  }

  public getTilePixelX(column: number): number {
    return this.collisionOffsetX + column * TileMap.TILE_SIZE;
  }

  public getTilePixelY(row: number): number {
    return this.collisionOffsetY + row * TileMap.TILE_SIZE;
  }

  public getCollisionTileWidth(column: number): number {
    const x = column * TileMap.TILE_SIZE;

    if (x < 0 || x >= this.collisionWidth) {
      return 0;
    }

    return Math.min(TileMap.TILE_SIZE, this.collisionWidth - x);
  }

  public getCollisionTileHeight(row: number): number {
    const y = row * TileMap.TILE_SIZE;

    if (y < 0 || y >= this.collisionHeight) {
      return 0;
    }

    return Math.min(TileMap.TILE_SIZE, this.collisionHeight - y);
  }

  public getTile(pixelX: number, pixelY: number): TileType {
    const column = this.getTileColumn(pixelX);
    const row = this.getTileRow(pixelY);

    return this.getTileAtGrid(column, row);
  }

  public getTileColumn(pixelX: number): number {
    return Math.floor((pixelX - this.collisionOffsetX) / TileMap.TILE_SIZE);
  }

  public getTileRow(pixelY: number): number {
    return Math.floor((pixelY - this.collisionOffsetY) / TileMap.TILE_SIZE);
  }

  public getTileAtGrid(column: number, row: number): TileType {
    if (row < 0 || row >= this.tiles.length || column < 0 || column >= this.tiles[0]!.length) {
      return TileType.Wall;
    }

    return this.tiles[row]![column]!;
  }

  public isBlockingTile(tile: TileType): boolean {
    return (
      tile === TileType.Wall ||
      tile === TileType.Water ||
      tile === TileType.Object ||
      tile === TileType.Cliff ||
      tile === TileType.Tree ||
      tile === TileType.Building ||
      tile === TileType.Sign
    );
  }

  public rectangleOverlapsTileType(
    x: number,
    y: number,
    width: number,
    height: number,
    type: TileType,
  ): boolean {
    if (
      x < this.collisionOffsetX ||
      y < this.collisionOffsetY ||
      x + width > this.collisionOffsetX + this.collisionWidth ||
      y + height > this.collisionOffsetY + this.collisionHeight
    ) {
      return false;
    }

    const left = this.getTileColumn(x);
    const right = this.getTileColumn(x + width - 1);
    const top = this.getTileRow(y);
    const bottom = this.getTileRow(y + height - 1);

    for (let row = top; row <= bottom; row++) {
      for (let column = left; column <= right; column++) {
        if (this.getTileAtGrid(column, row) === type) {
          return true;
        }
      }
    }

    return false;
  }

  public isBlocked(x: number, y: number, width: number, height: number): boolean {
    if (
      x < this.collisionOffsetX ||
      y < this.collisionOffsetY ||
      x + width > this.collisionOffsetX + this.collisionWidth ||
      y + height > this.collisionOffsetY + this.collisionHeight
    ) {
      return true;
    }

    const localX = x - this.collisionOffsetX;
    const localY = y - this.collisionOffsetY;

    const left = Math.floor(localX / TileMap.TILE_SIZE);
    const right = Math.floor((localX + width - 1) / TileMap.TILE_SIZE);

    const top = Math.floor(localY / TileMap.TILE_SIZE);
    const bottom = Math.floor((localY + height - 1) / TileMap.TILE_SIZE);

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

    if (columns !== this.columns || this.tiles.length !== this.rows) {
      throw new Error("TileMap collision grid dimensions changed after construction.");
    }
  }

  private validateCollisionBounds(): void {
    if (
      this.collisionWidth <= 0 ||
      this.collisionHeight <= 0 ||
      this.collisionOffsetX < 0 ||
      this.collisionOffsetY < 0 ||
      this.collisionOffsetX + this.collisionWidth > this.image.width ||
      this.collisionOffsetY + this.collisionHeight > this.image.height
    ) {
      throw new Error(
        `TileMap collision bounds ${this.collisionWidth}x${this.collisionHeight} ` +
          `at ${this.collisionOffsetX},${this.collisionOffsetY} ` +
          `must fit inside image ${this.image.width}x${this.image.height}.`,
      );
    }

    const requiredColumns = Math.ceil(this.collisionWidth / TileMap.TILE_SIZE);
    const requiredRows = Math.ceil(this.collisionHeight / TileMap.TILE_SIZE);

    if (this.columns < requiredColumns || this.rows < requiredRows) {
      throw new Error(
        `TileMap collision grid ${this.columns}x${this.rows} does not cover collision bounds ` +
          `${this.collisionWidth}x${this.collisionHeight}.`,
      );
    }
  }

  private validateWarps(): void {
    for (const warp of this.warps) {
      const x = this.getTilePixelX(warp.column);
      const y = this.getTilePixelY(warp.row);

      if (
        x < this.collisionOffsetX ||
        y < this.collisionOffsetY ||
        warp.width <= 0 ||
        warp.height <= 0 ||
        x + warp.width > this.collisionOffsetX + this.collisionWidth ||
        y + warp.height > this.collisionOffsetY + this.collisionHeight
      ) {
        throw new Error(
          `Warp at ${warp.column},${warp.row} (${warp.width}x${warp.height}) ` +
          `does not fit inside collision bounds ${this.collisionWidth}x${this.collisionHeight}.`,
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
