import { Sprite } from "@/engine/animation/Sprite";
import { Entity } from "./Entity";
import { Direction } from "./Direction";
import type { Dialogue } from "@/dialogue/Dialogue";

type DialogueSource = Dialogue | (() => Dialogue);

export class NPC extends Entity {
  constructor(
    x: number,
    y: number,
    sprite: Sprite,
    private readonly dialogue: DialogueSource,
    facing: Direction = Direction.Up,
    private readonly onInteract?: () => void,
  ) {
    super(x, y, 16, 16, sprite);

    this.direction = facing;
  }

  public update(): void {}

  public getDialogue(): Dialogue {
    if (typeof this.dialogue === "function") {
      return this.dialogue();
    }

    return this.dialogue;
  }

  public interact(): void {
    this.onInteract?.();
  }

  public override getCurrentFrame(): HTMLImageElement {
    return this.sprite.getFrame(this.direction, 0);
  }

  public face(direction: Direction): void {
    this.direction = direction;
  }
}
