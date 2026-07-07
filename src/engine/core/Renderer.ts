export class Renderer {
  public static readonly WIDTH = 480;
  public static readonly HEIGHT = 320;

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
    this.context.drawImage(sprite, Math.round(x - this.cameraX), Math.round(y - this.cameraY));
  }

  public drawMap(image: HTMLImageElement, x: number, y: number): void {
    this.context.drawImage(image, Math.round(x - this.cameraX), Math.round(y - this.cameraY));
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
}
