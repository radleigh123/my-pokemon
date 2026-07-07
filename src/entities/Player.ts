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

  constructor(
    x: number,
    y: number,
    sprite: Sprite,
    private readonly input: Input,
  ) {
    super(x, y, 16, 16, sprite);
  }

  public update(deltaTime: number): void {
    let moving = false;

    if (this.input.isPressed(Key.Up)) {
      this.direction = Direction.Up;
      this.y -= Player.SPEED;
      moving = true;
    } else if (this.input.isPressed(Key.Down)) {
      this.direction = Direction.Down;
      this.y += Player.SPEED;
      moving = true;
    } else if (this.input.isPressed(Key.Left)) {
      this.direction = Direction.Left;
      this.x -= Player.SPEED;
      moving = true;
    } else if (this.input.isPressed(Key.Right)) {
      this.direction = Direction.Right;
      this.x += Player.SPEED;
      moving = true;
    }

    if (moving) {
      this.walkAnimation.update(deltaTime);
    } else {
      this.walkAnimation.reset();
    }
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
}
