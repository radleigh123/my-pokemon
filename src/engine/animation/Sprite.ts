import { Direction } from "@/entities/Direction";

export class Sprite {
  constructor(private readonly frames: ReadonlyMap<Direction, readonly HTMLImageElement[]>) {}

  public getFrame(direction: Direction, index: number): HTMLImageElement {
    const animation = this.frames.get(direction);

    if (!animation) {
      throw new Error(`Missing animation for ${Direction[direction]}`);
    }

    if (index < 0 || index >= animation.length) {
      throw new Error(`Frame ${index} out of bounds for ${Direction[direction]}`);
    }

    return animation[index]!;
  }

  public getFrameCount(direction: Direction): number {
    return this.frames.get(direction)?.length ?? 0;
  }
}
