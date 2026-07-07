import { GameLoop } from "./GameLoop";
import { Renderer } from "./Renderer";
import { Direction } from "@/entities/Direction";
import type { Sprite } from "../animation/Sprite";
import { createPlayerSprite } from "@/assets/sprites/PlayerSprite";
import { AssetManager } from "../assets/AssetManager";
import { Animation } from "../animation/Animation";
import { Keyboard } from "../input/Keyboard";
import { Input } from "../input/Input";
import { Player } from "@/entities/Player";
import { Camera } from "./Camera";
import type { TileMap } from "../map/TileMap";
import { createLab } from "@/maps/Lab";
import { World } from "../world/World";

export class Game {
  private readonly loop: GameLoop;
  private readonly renderer: Renderer;
  private readonly assets: AssetManager;
  private readonly keyboard = new Keyboard();
  private readonly input = new Input(this.keyboard);
  private readonly camera = new Camera();

  private playerSprite!: Sprite;
  private world!: World;

  // private readonly animation = new Animation(3, 150); // test

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.assets = new AssetManager();

    this.loop = new GameLoop(this.update, this.render);
  }

  public async start(): Promise<void> {
    const map = await createLab(this.assets);
    const sprite = await createPlayerSprite(this.assets);

    const player = new Player(100, 60, this.playerSprite, this.input);

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
