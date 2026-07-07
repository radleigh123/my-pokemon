export class ImageLoader {
  public static load(src: string): HTMLImageElement {
    const image = new Image();
    image.src = src;
    return image;
  }
}
