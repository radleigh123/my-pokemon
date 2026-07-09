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
import { TileMap } from "../map/TileMap";
import { createNpcSprite } from "@/assets/sprites/NpcSprite";
import { Key } from "../input/Key";
import { AudioManager } from "@/audio/AudioManager";
import { Music } from "@/audio/Music";
import { Sound } from "@/audio/Sound";
import { Direction } from "@/entities/Direction";

export class Game {
  private readonly loop: GameLoop;
  private readonly renderer: Renderer;
  private readonly assets: AssetManager;
  private readonly keyboard = new Keyboard();
  private readonly input = new Input(this.keyboard);
  private readonly camera = new Camera();
  private readonly audio = new AudioManager();

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

    await this.audio.play(map.getMusic());

    const sprite = await createPlayerSprite(this.assets);

    const npcSprite = await createNpcSprite(this.assets);

    console.log("NPCSprite", npcSprite.getFrameCount(Direction.Down));

    const player = new Player(
      map.getSpawnX() * TileMap.TILE_SIZE,
      map.getSpawnY() * TileMap.TILE_SIZE + 65,
      sprite,
      this.input,
    );
    console.log("loading player...");

    this.world = new World(map, player, npcSprite, this.camera);

    this.loop.start();
  }

  public stop(): void {
    this.audio.stop();
    this.loop.stop();
  }

  private update = (deltaTime: number): void => {
    if (this.input.isJustPressed(Key.A)) {
      if (this.world.interact()) {
        this.audio.button();
      }
    }

    this.world.update(deltaTime);

    this.input.endFrame();
  };

  private render = (): void => {
    this.renderer.clear();
    this.world.render(this.renderer);
  };

  public getDialogue() {
    return this.world.getDialogue();
  }

  public getAudio(): AudioManager {
    return this.audio;
  }
}
