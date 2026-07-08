import { Renderer } from "./Renderer";

export class Camera {
  private x = 0;
  private y = 0;

  public follow(targetX: number, targetY: number, mapWidth: number, mapHeight: number): void {

    if (mapWidth <= Renderer.WIDTH) {
      this.x = -(Renderer.WIDTH - mapWidth) / 2;
    } else {
      this.x = targetX - Renderer.WIDTH / 2;

      this.x = Math.max(
        0,
        Math.min(this.x, mapWidth - Renderer.WIDTH)
      );
    }

    if (mapHeight <= Renderer.HEIGHT) {
      this.y = -(Renderer.HEIGHT - mapHeight) / 2;
    } else {
      this.y = targetY - Renderer.HEIGHT / 2;

      this.y = Math.max(
        0,
        Math.min(this.y, mapHeight - Renderer.HEIGHT)
      );
    }
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }
}
