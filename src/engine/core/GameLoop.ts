export type UpdateCallback = (deltaTime: number) => void;
export type RenderCallback = () => void;

export class GameLoop {
  private static readonly TIMESTEP = 1000 / 60;
  private static readonly MAX_ACCUMULATED_TIME = 250;

  private lastTime = 0;
  private accumulator = 0;
  private animationFrameId = 0;
  private running = false;

  constructor(
    private readonly update: UpdateCallback,
    private readonly render: RenderCallback,
  ) {}

  public start(): void {
    if (this.running) return;

    this.running = true;
    this.lastTime = performance.now();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.running = false;
    cancelAnimationFrame(this.animationFrameId);
  }

  private loop = (currentTime: number): void => {
    if (!this.running) return;

    const elapsed = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.accumulator = Math.min(this.accumulator + elapsed, GameLoop.MAX_ACCUMULATED_TIME);

    while (this.accumulator >= GameLoop.TIMESTEP) {
      this.update(GameLoop.TIMESTEP);
      this.accumulator -= GameLoop.TIMESTEP;
    }

    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
