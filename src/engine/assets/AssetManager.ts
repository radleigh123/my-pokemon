import { ImageLoader } from "./ImageLoader";

export class AssetManager {
  private readonly images = new Map<string, HTMLImageElement>();

  public async loadImage(src: string): Promise<HTMLImageElement> {
    const cached = this.images.get(src);

    if (cached) {
      return cached;
    }

    const image = await ImageLoader.load(src);

    this.images.set(src, image);

    return image;
  }

  public getImage(src: string): HTMLImageElement {
    const image = this.images.get(src);

    if (!image) {
      throw new Error(`Image not loaded: ${src}`);
    }

    return image;
  }
}
