import { Sprite } from "@/engine/animation/Sprite";

import { Direction } from "./Direction";

export abstract class Entity {
  protected x: number;
  protected y: number;

  protected readonly width: number;
  protected readonly height: number;

  protected direction: Direction;

  protected readonly sprite: Sprite;

  protected constructor(x: number, y: number, width: number, height: number, sprite: Sprite) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.direction = Direction.Down;

    this.sprite = sprite;
  }

  public abstract update(deltaTime: number): void;

  public abstract getCurrentFrame(): HTMLImageElement;

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public getCollisionX(): number {
    return this.x;
  }

  public getCollisionY(): number {
    return this.y;
  }

  public getCollisionWidth(): number {
    return 16;
  }

  public getCollisionHeight(): number {
    return 16;
  }

  public intersects(other: Entity): boolean {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }
}
