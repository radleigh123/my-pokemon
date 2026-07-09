import { Animation } from "@/engine/animation/Animation";
import { Input } from "@/engine/input/Input";
import { Key } from "@/engine/input/Key";
import { Sprite } from "@/engine/animation/Sprite";

import { Direction } from "./Direction";
import { Entity } from "./Entity";

export class Player extends Entity {
  private static readonly SPEED = 1;

  private readonly idleAnimation = new Animation([0], 150);
  private readonly walkAnimation = new Animation([0, 1, 0, 2], 150);

  private mapWidth = Number.MAX_SAFE_INTEGER;
  private mapHeight = Number.MAX_SAFE_INTEGER;

  private nextX = 0;
  private nextY = 0;

  private warpCooldown = 0;

  constructor(
    x: number,
    y: number,
    sprite: Sprite,
    private readonly input: Input,
  ) {
    super(x, y, 16, 16, sprite);
    this.nextX = x;
    this.nextY = y;
  }

  public update(deltaTime: number): void {
    if (this.warpCooldown > 0) {
      this.warpCooldown -= deltaTime;
    }

    let moving = false;

    this.nextX = this.x;
    this.nextY = this.y;

    if (this.input.isPressed(Key.Up)) {
      this.direction = Direction.Up;
      this.nextY -= Player.SPEED;
      moving = true;
    } else if (this.input.isPressed(Key.Down)) {
      this.direction = Direction.Down;
      this.nextY += Player.SPEED;
      moving = true;
    } else if (this.input.isPressed(Key.Left)) {
      this.direction = Direction.Left;
      this.nextX -= Player.SPEED;
      moving = true;
    } else if (this.input.isPressed(Key.Right)) {
      this.direction = Direction.Right;
      this.nextX += Player.SPEED;
      moving = true;
    }

    if (moving) {
      this.walkAnimation.update(deltaTime);
    } else {
      this.walkAnimation.reset();
    }
  }

  public canWarp(): boolean {
    return this.warpCooldown <= 0;
  }

  public resetWarpCooldown(): void {
    this.warpCooldown = 1500;
    console.log("warp", this.warpCooldown);
  }

  public override getCurrentFrame(): HTMLImageElement {
    return this.sprite.getFrame(
      this.direction,
      this.inputMoving() ? this.walkAnimation.getFrame() : this.idleAnimation.getFrame(),
    );
  }

  private inputMoving(): boolean {
    return (
      this.input.isPressed(Key.Up) ||
      this.input.isPressed(Key.Down) ||
      this.input.isPressed(Key.Left) ||
      this.input.isPressed(Key.Right)
    );
  }

  public setMapSize(width: number, height: number): void {
    this.mapWidth = width;
    this.mapHeight = height;
  }

  public getNextPosition(): { x: number; y: number } {
    return {
      x: this.nextX,
      y: this.nextY,
    };
  }

  public getFacingTile(): { x: number; y: number } {
    let column = Math.floor(this.getCollisionX() / 16);
    let row = Math.floor(this.getCollisionY() / 16);

    switch (this.direction) {
      case Direction.Up:
        row--;
        break;

      case Direction.Down:
        row++;
        break;

      case Direction.Left:
        column--;
        break;

      case Direction.Right:
        column++;
        break;
    }

    return {
      x: column * 16,
      y: row * 16,
    };
  }

  public override getCollisionX(): number {
    return this.x + 2;
  }

  public override getCollisionY(): number {
    return this.y + 4;
  }

  public override getCollisionWidth(): number {
    return 12;
  }

  public override getCollisionHeight(): number {
    return 12;
  }

  public getDirection(): Direction {
    return this.direction;
  }
}
