import { Sprite } from "@/engine/animation/Sprite";
import { Entity } from "./Entity";
import { Direction } from "./Direction";
import type { Dialogue } from "@/dialogue/Dialogue";

export class NPC extends Entity {
  constructor(
    x: number,
    y: number,
    sprite: Sprite,
    private readonly dialogue: Dialogue,
    facing: Direction = Direction.Up,
  ) {
    super(x, y, 16, 16, sprite);

    this.direction = facing;
  }

  public update(): void {}

  public getDialogue(): Dialogue {
    return this.dialogue;
  }

  public override getCurrentFrame(): HTMLImageElement {
    return this.sprite.getFrame(this.direction, 0);
  }

  public face(direction: Direction): void {
    this.direction = direction;
  }
}
