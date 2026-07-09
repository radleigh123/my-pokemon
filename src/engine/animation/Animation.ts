export class Animation {
  private elapsed = 0;
  private currentIndex = 0;

  constructor(
    private readonly sequence: readonly number[],
    private readonly frameDuration: number,
    private readonly looping = true,
  ) {}

  public update(deltaTime: number): void {
    this.elapsed += deltaTime;

    while (this.elapsed >= this.frameDuration) {
      this.elapsed -= this.frameDuration;

      if (this.looping) {
        this.currentIndex = (this.currentIndex + 1) % this.sequence.length;
      } else if (this.currentIndex < this.sequence.length - 1) {
        this.currentIndex++;
      }
    }
  }

  public reset(): void {
    this.elapsed = 0;
    this.currentIndex = 0;
  }

  public getFrame(): number {
    return this.sequence[this.currentIndex]!;
  }

  public isFinished(): boolean {
    return !this.looping && this.currentIndex === this.sequence.length - 1;
  }
}
