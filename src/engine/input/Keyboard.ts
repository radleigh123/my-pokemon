import { Key } from "./Key";

export class Keyboard {
  private readonly pressed = new Set<Key>();

  constructor() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const key = event.code as Key;

    if (Object.values(Key).includes(key)) {
      event.preventDefault();
      this.pressed.add(key);
    }
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    const key = event.code as Key;

    if (Object.values(Key).includes(key)) {
      event.preventDefault();
      this.pressed.delete(key);
    }
  };

  public isPressed(key: Key): boolean {
    return this.pressed.has(key);
  }

  public destroy(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }
}
