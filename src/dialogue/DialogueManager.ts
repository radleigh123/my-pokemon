import { Dialogue } from "./Dialogue";

export class DialogueManager {
  private dialogue?: Dialogue;
  private lineIndex = 0;

  public start(dialogue: Dialogue): void {
    console.log("START DIALOGUE", dialogue);

    this.dialogue = dialogue;
    this.lineIndex = 0;
  }

  public close(): void {
    this.dialogue = undefined;
    this.lineIndex = 0;
  }

  public isActive(): boolean {
    return this.dialogue !== undefined;
  }

  public next(): void {
    if (!this.dialogue) {
      return;
    }

    this.lineIndex++;

    if (this.lineIndex >= this.dialogue.lines.length) {
      this.close();
    }
  }

  public getSpeaker(): string {
    return this.dialogue?.speaker ?? "";
  }

  public getCurrentLine(): string {
    if (!this.dialogue) {
      return "";
    }

    return this.dialogue.lines[this.lineIndex]!;
  }

  public getText(): string {
    return this.dialogue?.lines[this.lineIndex] ?? "";
  }
}
