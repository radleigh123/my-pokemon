import { Animation } from "@/engine/animation/Animation";
import { Sprite } from "@/engine/animation/Sprite";
import { Direction } from "@/entities/Direction";

export class Door {
  private readonly animation = new Animation([0, 1, 2, 3], 80, false);

  private opening = false;
  private finished = false;

  constructor(
    private readonly id: string,
    private readonly x: number,
    private readonly y: number,
    private readonly sprite: Sprite,
  ) {}

  public open(): void {
    if (this.opening) {
      return;
    }

    this.animation.reset();

    this.opening = true;
    this.finished = false;
  }

  public update(deltaTime: number): void {
    if (!this.opening) {
      return;
    }

    this.animation.update(deltaTime);

    if (this.animation.isFinished()) {
      this.opening = false;
      this.finished = true;
    }
  }

  public reset(): void {
    this.animation.reset();

    this.opening = false;
    this.finished = false;
  }

  public isFinished(): boolean {
    return this.finished;
  }

  public renderFrame(): HTMLImageElement {
    return this.sprite.getFrame(Direction.Down, this.animation.getFrame());
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getId(): string {
    return this.id;
  }
}
