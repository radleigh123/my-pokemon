import { GameLoop } from "./GameLoop";
import { Renderer } from "./Renderer";
import { createPlayerSprite } from "@/assets/sprites/PlayerSprite";
import { AssetManager } from "../assets/AssetManager";
import { Keyboard } from "../input/Keyboard";
import { Input } from "../input/Input";
import { Player } from "@/entities/Player";
import { Camera } from "./Camera";
import { World } from "../world/World";
import { TileMap } from "../map/TileMap";
import { Key } from "../input/Key";
import { AudioManager } from "@/audio/AudioManager";
import { MapId, MapManager } from "../map/MapManager";
import { createDoorSprite } from "@/assets/sprites/DoorSprite";

export class Game {
  private readonly loop: GameLoop;
  private readonly renderer: Renderer;
  private readonly assets: AssetManager;
  private readonly keyboard = new Keyboard();
  private readonly input = new Input(this.keyboard);
  private readonly camera = new Camera();
  private readonly audio = new AudioManager();
  private maps!: MapManager;

  private world!: World;
  private player!: Player;
  private currentMap = MapId.Lab;
  private loadingMap = false;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.assets = new AssetManager();
    // this.maps = new MapManager(this.assets);
    this.loop = new GameLoop(this.update, this.render);
  }

  public async start(): Promise<void> {
    const sprite = await createPlayerSprite(this.assets);

    const doorSprite = await createDoorSprite(this.assets);

    this.maps = new MapManager(this.assets, doorSprite);

    /* this.player = new Player(
      map.getSpawnX() * TileMap.TILE_SIZE,
      map.getSpawnY() * TileMap.TILE_SIZE + 65,
      sprite,
      this.input,
    );
    console.log("loading player...");

    this.world = new World(map, this.player, gameMap.npcs, this.camera);

    this.loop.start(); */
    this.player = new Player(0, 0, sprite, this.input);

    await this.loadMap(MapId.Lab);

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

    if (this.loadingMap) {
      this.input.endFrame();
      return;
    }

    this.world.update(deltaTime);

    const warp = this.world.getPendingWarp();

    if (warp) {
      console.log("Destination:", MapId[warp.destination]);
      this.loadingMap = true;

      void this.loadMap(warp.destination, warp.spawnColumn, warp.spawnRow).finally(() => {
        this.loadingMap = false;
      });
    }

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

  private async loadMap(id: MapId, spawnColumn?: number, spawnRow?: number): Promise<void> {
    console.log("Loading map:", MapId[id]);
    const gameMap = await this.maps.load(id);
    console.log(gameMap);
    const map = gameMap.tileMap;

    const column = spawnColumn ?? map.getSpawnX();
    const row = spawnRow ?? map.getSpawnY();

    this.player.setPosition(column * TileMap.TILE_SIZE, row * TileMap.TILE_SIZE);

    await this.audio.play(map.getMusic());

    this.world = new World(map, this.player, gameMap.npcs, gameMap.door, this.camera);

    gameMap.door?.reset();

    this.currentMap = id;
  }
}
