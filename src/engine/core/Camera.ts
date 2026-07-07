export class Camera {
  private x = 0;
  private y = 0;

  public follow(targetX: number, targetY: number): void {
    this.x = targetX;
    this.y = targetY;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }
}
