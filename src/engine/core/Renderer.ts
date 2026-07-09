import type { Door } from "@/entities/Door";
import { TileMap } from "../map/TileMap";
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

  public drawSprite(sprite: HTMLImageElement, x: number, y: number): void {
    this.context.drawImage(
      sprite,
      Math.round(x - this.cameraX),
      Math.round(y - (sprite.height - 16) - this.cameraY),
    );
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
    for (let row = 0; row < map.getRows(); row++) {
      for (let col = 0; col < map.getColumns(); col++) {
        if (map.getTile(col * TileMap.TILE_SIZE, row * TileMap.TILE_SIZE) === TileType.Wall) {
          this.context.strokeStyle = "red";

          this.context.strokeRect(col * 16 - this.cameraX, row * 16 - this.cameraY, 16, 16);
        }
      }
    }
  }

  public drawWarps(map: TileMap): void {
    this.context.strokeStyle = "cyan";
    this.context.lineWidth = 2;

    for (const warp of map.getWarps()) {
      this.context.strokeRect(
        warp.column * TileMap.TILE_SIZE - this.cameraX,
        warp.row * TileMap.TILE_SIZE - this.cameraY,
        warp.width,
        warp.height,
      );
    }
  }

  public drawMapCentered(image: HTMLImageElement): void {
    const x = (this.canvas.width - image.width) / 2;

    const y = (this.canvas.height - image.height) / 2;

    this.context.drawImage(image, Math.round(x - this.cameraX), Math.round(y - this.cameraY));
  }

  public drawDoor(door: Door): void {
    this.drawSprite(door.renderFrame(), door.getX(), door.getY());
  }
}
