export class Renderer {
  public static readonly WIDTH = 240;
  public static readonly HEIGHT = 160;

  private backgroundColor = "black";

  private readonly context: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.canvas.width = Renderer.WIDTH;
    this.canvas.height = Renderer.HEIGHT;

    const context = this.canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to acquire 2D rendering context.");
    }

    context.imageSmoothingEnabled = false;

    this.context = context;
  }

  public drawImage(image: CanvasImageSource, x: number, y: number): void {
    this.context.drawImage(image, x, y);
  }

  public drawSprite(
    sprite: HTMLImageElement,
    x: number,
    y: number,
    cameraX = 0,
    cameraY = 0,
  ): void {
    this.context.drawImage(sprite, Math.round(x - cameraX), Math.round(y - cameraY));
  }

  public drawMap(
    map: HTMLImageElement,
    x: number,
    y: number,
    cameraX: number,
    cameraY: number,
  ): void {
    this.context.drawImage(map, Math.round(x - cameraX), Math.round(y - cameraY));
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
}
