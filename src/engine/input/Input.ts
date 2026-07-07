import type { Key } from "./Key";
import type { Keyboard } from "./Keyboard";

export class Input {
  constructor(private readonly keyboard: Keyboard) {}

  public isPressed(key: Key): boolean {
    return this.keyboard.isPressed(key);
  }
}
