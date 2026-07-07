import { GameLoop } from "./GameLoop";
import { Renderer } from "./Renderer";
import { createPlayerSprite } from "@/assets/sprites/PlayerSprite";
import { AssetManager } from "../assets/AssetManager";
import { Keyboard } from "../input/Keyboard";
import { Input } from "../input/Input";
import { Player } from "@/entities/Player";
import { Camera } from "./Camera";
import { createLab } from "@/maps/Lab";
import { World } from "../world/World";

export class Game {
  private readonly loop: GameLoop;
  private readonly renderer: Renderer;
  private readonly assets: AssetManager;
  private readonly keyboard = new Keyboard();
  private readonly input = new Input(this.keyboard);
  private readonly camera = new Camera();

  private world!: World;

  // private readonly animation = new Animation(3, 150); // test

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.assets = new AssetManager();

    this.loop = new GameLoop(this.update, this.render);
  }

  public async start(): Promise<void> {
    console.log("loading map...");

    const map = await createLab(this.assets);

    const sprite = await createPlayerSprite(this.assets);

    console.log(sprite);

    const player = new Player(100, 60, sprite, this.input);
    console.log("loading player...");

    this.world = new World(map, player, this.camera);

    this.loop.start();
  }

  public stop(): void {
    this.loop.stop();
  }

  private update = (deltaTime: number): void => {
    this.world.update(deltaTime);
  };

  private render = (): void => {
    this.renderer.clear();
    this.world.render(this.renderer);
  };
}
