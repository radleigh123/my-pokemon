import { Animation } from "@/engine/animation/Animation";
import { Sprite } from "@/engine/animation/Sprite";

import { Dialogue } from "@/dialogue/Dialogue";

import { Direction } from "./Direction";
import { Entity } from "./Entity";

export class NPC extends Entity {
  private readonly idle = new Animation([0], 200);

  constructor(
    x: number,
    y: number,
    sprite: Sprite,
    private readonly dialogue: Dialogue,
  ) {
    super(x, y, 16, 16, sprite);
  }

  public update(deltaTime: number): void {
    this.idle.update(deltaTime);
  }

  public getDialogue(): Dialogue {
    return this.dialogue;
  }

  public override getCurrentFrame(): HTMLImageElement {
    return this.sprite.getFrame(this.direction, this.idle.getFrame());
  }
}
