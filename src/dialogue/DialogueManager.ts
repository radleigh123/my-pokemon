import { Dialogue } from "./Dialogue";

export class DialogueManager {
  private static readonly REVEAL_INTERVAL = 35;
  private static readonly FAST_REVEAL_INTERVAL = 20;

  private dialogue?: Dialogue;
  private lineIndex = 0;
  private visibleCharacterCount = 0;
  private revealTimer = 0;

  public start(dialogue: Dialogue): void {
    this.dialogue = dialogue;
    this.lineIndex = 0;
    this.visibleCharacterCount = 0;
    this.revealTimer = 0;
  }

  public close(): void {
    this.dialogue = undefined;
    this.lineIndex = 0;
    this.visibleCharacterCount = 0;
    this.revealTimer = 0;
  }

  public isActive(): boolean {
    return this.dialogue !== undefined;
  }

  public update(deltaTime: number, isSpeedUpPressed: boolean): void {
    if (!this.dialogue || this.isCurrentLineComplete()) {
      return;
    }

    const interval = isSpeedUpPressed
      ? DialogueManager.FAST_REVEAL_INTERVAL
      : DialogueManager.REVEAL_INTERVAL;

    this.revealTimer += deltaTime;

    while (this.revealTimer >= interval && !this.isCurrentLineComplete()) {
      this.visibleCharacterCount++;
      this.revealTimer -= interval;
    }
  }

  public confirm(): void {
    if (!this.dialogue) {
      return;
    }

    if (!this.isCurrentLineComplete()) {
      this.finishCurrentLine();
      return;
    }

    this.next();
  }

  public next(): void {
    if (!this.dialogue) {
      return;
    }

    this.lineIndex++;

    if (this.lineIndex >= this.dialogue.lines.length) {
      this.close();
      return;
    }

    this.visibleCharacterCount = 0;
    this.revealTimer = 0;
  }

  public getSpeaker(): string {
    return this.dialogue?.speaker ?? "";
  }

  public getCurrentLine(): string {
    if (!this.dialogue) {
      return "";
    }

    return this.getFullCurrentLine().slice(0, this.visibleCharacterCount);
  }

  public getText(): string {
    return this.getCurrentLine();
  }

  public isCurrentLineComplete(): boolean {
    return this.visibleCharacterCount >= this.getFullCurrentLine().length;
  }

  private finishCurrentLine(): void {
    this.visibleCharacterCount = this.getFullCurrentLine().length;
    this.revealTimer = 0;
  }

  private getFullCurrentLine(): string {
    return this.dialogue?.lines[this.lineIndex] ?? "";
  }
}
