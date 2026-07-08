import type { Key } from "./Key";
import type { Keyboard } from "./Keyboard";

export class Input {
  constructor(private readonly keyboard: Keyboard) {}

  public isPressed(key: Key): boolean {
    return this.keyboard.isPressed(key);
  }

  public isJustPressed(key: Key): boolean {
    return this.keyboard.isJustPressed(key);
  }

  public endFrame(): void {
    this.keyboard.endFrame();
  }
}
