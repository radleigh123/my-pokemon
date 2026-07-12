import type { Door } from "@/entities/Door";
import { TileMap } from "../map/TileMap";
import type { MapObject } from "../map/MapObject";
import { Direction } from "@/entities/Direction";
import { TileType } from "../map/TileType";

export class Renderer {
  public static readonly WIDTH = 240;
  public static readonly HEIGHT = 160;

  private backgroundColor = "black";

  private readonly context: CanvasRenderingContext2D;

  private cameraX = 0;
  private cameraY = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    canvas.width = Renderer.WIDTH;
    canvas.height = Renderer.HEIGHT;

    const context = this.canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to acquire 2D rendering context.");
    }

    context.imageSmoothingEnabled = false;

    this.context = context;
  }

  public getWidth(): number {
    return this.canvas.width;
  }

  public getHeight(): number {
    return this.canvas.height;
  }

  public drawImage(image: CanvasImageSource, x: number, y: number): void {
    this.context.drawImage(image, x, y);
  }

  public drawSprite(sprite: HTMLImageElement, x: number, y: number, opacity = 1): void {
    this.context.save();
    this.context.globalAlpha = Math.max(0, Math.min(opacity, 1));
    this.context.drawImage(
      sprite,
      Math.round(x - this.cameraX),
      Math.round(y - (sprite.height - 16) - this.cameraY),
    );
    this.context.restore();
  }

  public drawWorldImage(image: CanvasImageSource, x: number, y: number, opacity = 1): void {
    this.context.save();
    this.context.globalAlpha = Math.max(0, Math.min(opacity, 1));
    this.context.drawImage(
      image,
      Math.round(x - this.cameraX),
      Math.round(y - this.cameraY),
    );
    this.context.restore();
  }

  public drawMap(map: TileMap): void {
    this.context.drawImage(
      map.getImage(),
      Math.round(-this.cameraX),
      Math.round(-this.cameraY),
      map.getPixelWidth(),
      map.getPixelHeight(),
    );
  }

  public setCamera(x: number, y: number): void {
    this.cameraX = x;
    this.cameraY = y;
  }

  public fill(color: string): void {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, Renderer.WIDTH, Renderer.HEIGHT);
  }

  public fadeToBlack(opacity: number): void {
    this.context.save();
    this.context.globalAlpha = Math.max(0, Math.min(opacity, 1));
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, Renderer.WIDTH, Renderer.HEIGHT);
    this.context.restore();
  }

  public setBackground(color: string): void {
    this.backgroundColor = color;
  }

  public clear(): void {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, Renderer.WIDTH, Renderer.HEIGHT);
  }

  public drawRectangle(x: number, y: number, width: number, height: number): void {
    this.context.strokeStyle = "red";

    this.context.strokeRect(x - this.cameraX, y - this.cameraY, width, height);
  }

  public drawPoint(x: number, y: number): void {
    this.context.fillStyle = "yellow";

    this.context.fillRect(Math.round(x - this.cameraX) - 1, Math.round(y - this.cameraY) - 1, 3, 3);
  }

  public drawCollision(map: TileMap): void {
    this.context.save();
    this.context.lineWidth = 1;

    for (let row = 0; row < map.getRows(); row++) {
      for (let col = 0; col < map.getColumns(); col++) {
        const x = map.getTilePixelX(col);
        const y = map.getTilePixelY(row);
        const width = map.getCollisionTileWidth(col);
        const height = map.getCollisionTileHeight(row);

        if (width <= 0 || height <= 0) {
          continue;
        }

        const tile = map.getTile(x, y);

        this.context.strokeStyle = this.getCollisionDebugColor(tile, map.isBlockingTile(tile));
        this.context.strokeRect(x - this.cameraX, y - this.cameraY, width, height);
      }
    }

    this.context.restore();
  }

  public drawWarps(map: TileMap): void {
    this.context.save();
    this.context.strokeStyle = "cyan";
    this.context.lineWidth = 2;

    for (const warp of map.getWarps()) {
      this.context.strokeRect(
        map.getTilePixelX(warp.column) - this.cameraX,
        map.getTilePixelY(warp.row) - this.cameraY,
        warp.width,
        warp.height,
      );
    }

    this.context.restore();
  }

  public drawDoor(door: Door): void {
    this.drawSprite(door.renderFrame(), door.getX(), door.getY());
  }

  public drawObject(object: MapObject): void {
    if (!object.sprite) {
      return;
    }

    this.context.drawImage(
      object.sprite.getFrame(Direction.Down, 0),
      Math.round(object.x - this.cameraX),
      Math.round(object.y - this.cameraY),
    );
  }

  private getCollisionDebugColor(tile: TileType, blocking: boolean): string {
    switch (tile) {
      case TileType.Tree:
        return "rgba(46, 204, 113, 0.9)";

      case TileType.Building:
        return "rgba(231, 76, 60, 0.95)";

      case TileType.Sign:
        return "rgba(241, 196, 15, 0.95)";

      case TileType.Cliff:
        return "rgba(230, 126, 34, 0.95)";

      case TileType.Warp:
      case TileType.Door:
        return "rgba(0, 255, 255, 0.8)";

      case TileType.Grass:
        return "rgba(52, 152, 219, 0.45)";

      default:
        return blocking ? "red" : "rgba(255, 255, 255, 0.25)";
    }
  }
}
