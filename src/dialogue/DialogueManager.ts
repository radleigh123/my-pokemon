import { Dialogue } from "./Dialogue";

export class DialogueManager {
  private dialogue?: Dialogue;

  private lineIndex = 0;

  public start(dialogue: Dialogue): void {
    this.dialogue = dialogue;
    this.lineIndex = 0;
  }

  public next(): void {
    if (!this.dialogue) {
      return;
    }

    this.lineIndex++;

    if (this.lineIndex >= this.dialogue.lines.length) {
      this.dialogue = undefined;
    }
  }

  public isOpen(): boolean {
    return this.dialogue !== undefined;
  }

  public getSpeaker(): string {
    return this.dialogue?.speaker ?? "";
  }

  public getText(): string {
    return this.dialogue?.lines[this.lineIndex] ?? "";
  }
}
