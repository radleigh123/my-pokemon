export class ImageLoader {
  public static async load(src: string): Promise<HTMLImageElement> {
    const image = new Image();

    image.src = src;

    await image.decode();

    return image;
  }
}
