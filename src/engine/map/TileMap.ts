export class TileMap {
  constructor(
    private readonly image: HTMLImageElement,
    private readonly width: number,
    private readonly height: number,
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
}
