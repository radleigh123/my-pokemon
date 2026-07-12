import { GameLoop } from "./GameLoop";
import { Renderer } from "./Renderer";
import { createPlayerSprite } from "@/assets/sprites/PlayerSprite";
import { AssetManager } from "../assets/AssetManager";
import { Keyboard } from "../input/Keyboard";
import { Input } from "../input/Input";
import { Player } from "@/entities/Player";
import { Camera } from "./Camera";
import { World } from "../world/World";
import { Key } from "../input/Key";
import { AudioManager } from "@/audio/AudioManager";
import { MapId, MapManager } from "../map/MapManager";
import { createDoorSprite } from "@/assets/sprites/DoorSprite";
import { TileType } from "../map/TileType";
import type { Direction } from "@/entities/Direction";

type TransitionPhase = "none" | "fadeOut" | "loading" | "fadeIn";

export class Game {
  private static readonly TRANSITION_DURATION = 220;

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
  private loadingMap = false;
  private playerWasInGrass = false;
  private transitionPhase: TransitionPhase = "none";
  private transitionOpacity = 0;
  private transitionTarget?: {
    id: MapId;
    spawnColumn: number;
    spawnRow: number;
    spawnDirection?: Direction;
  };

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.assets = new AssetManager();
    this.loop = new GameLoop(this.update, this.render);
  }

  public async start(): Promise<void> {
    const sprite = await createPlayerSprite(this.assets);

    const doorSprite = await createDoorSprite(this.assets);

    this.maps = new MapManager(this.assets, doorSprite);

    this.player = new Player(0, 0, sprite, this.input);

    await this.loadMap(MapId.Lab);

    this.loop.start();
  }

  public stop(): void {
    this.audio.stop();
    this.loop.stop();
    this.input.destroy();
  }

  private update = (deltaTime: number): void => {
    if (this.transitionPhase !== "none") {
      this.updateTransition(deltaTime);
      this.input.endFrame();
      return;
    }

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

    if (this.world.isWarpAnimationInProgress()) {
      this.input.endFrame();
      return;
    }

    this.updateGrassEncounterHook();

    const warp = this.world.getPendingWarp();

    if (warp) {
      this.startMapTransition(warp.destination, warp.spawnColumn, warp.spawnRow, {
        skipFadeOut: warp.requiresDoorAnimation === true || warp.requiresEntryAnimation === true,
        spawnDirection: warp.spawnDirection,
      });
    }

    this.input.endFrame();
  };

  private render = (): void => {
    this.renderer.clear();
    this.world.render(this.renderer);
    this.world.drawPlayerCollision(this.renderer);
    this.renderer.drawCollision(this.world.getTileMap());
    // this.renderer.drawWarps(this.world.getTileMap());

    if (this.transitionOpacity > 0) {
      this.renderer.fadeToBlack(this.transitionOpacity);
    }
  };

  public getDialogue() {
    return this.world.getDialogue();
  }

  public getAudio(): AudioManager {
    return this.audio;
  }

  private async loadMap(
    id: MapId,
    spawnColumn?: number,
    spawnRow?: number,
    spawnDirection?: Direction,
  ): Promise<void> {
    const gameMap = await this.maps.load(id);
    const map = gameMap.tileMap;

    const column = spawnColumn ?? map.getSpawnX();
    const row = spawnRow ?? map.getSpawnY();

    const playerX = map.getTilePixelX(column);
    const playerY = map.getTilePixelY(row);
    const collisionX = playerX + (this.player.getCollisionX() - this.player.getX());
    const collisionY = playerY + (this.player.getCollisionY() - this.player.getY());

    const nextWorld = new World(
      map,
      this.player,
      gameMap.npcs,
      gameMap.objects ?? [],
      gameMap.doors ?? [],
      this.camera,
    );

    if (
      nextWorld.isBlocked(
        collisionX,
        collisionY,
        this.player.getCollisionWidth(),
        this.player.getCollisionHeight(),
      )
    ) {
      throw new Error(`Invalid spawn ${column},${row} for map ${MapId[id]}.`);
    }

    await this.audio.play(map.getMusic());

    this.player.setPosition(playerX, playerY);

    if (spawnDirection !== undefined) {
      this.player.face(spawnDirection);
    }

    this.player.resetWarpCooldown();

    this.camera.follow(
      this.player.getCollisionX() + this.player.getCollisionWidth() / 2,
      this.player.getCollisionY() + this.player.getCollisionHeight() / 2,
      map.getPixelWidth(),
      map.getPixelHeight(),
    );

    this.world = nextWorld;

    for (const door of gameMap.doors ?? []) {
      door.reset();
    }

    this.playerWasInGrass = this.world.getPlayerTile() === TileType.Grass;
  }

  private updateGrassEncounterHook(): void {
    const playerIsInGrass = this.world.getPlayerTile() === TileType.Grass;

    if (playerIsInGrass && !this.playerWasInGrass) {
      this.onPlayerEnteredGrass();
    }

    this.playerWasInGrass = playerIsInGrass;
  }

  private onPlayerEnteredGrass(): void {
    // Future wild encounter hook.
  }

  private startMapTransition(
    id: MapId,
    spawnColumn: number,
    spawnRow: number,
    options: { skipFadeOut?: boolean; spawnDirection?: Direction } = {},
  ): void {
    if (this.loadingMap) {
      return;
    }

    this.loadingMap = true;
    this.transitionOpacity = 0;
    this.transitionTarget = {
      id,
      spawnColumn,
      spawnRow,
      spawnDirection: options.spawnDirection,
    };

    if (options.skipFadeOut === true) {
      this.transitionPhase = "loading";
      this.loadTransitionTarget();
      return;
    }

    this.transitionPhase = "fadeOut";
  }

  private updateTransition(deltaTime: number): void {
    if (this.transitionPhase === "fadeOut") {
      this.transitionOpacity += deltaTime / Game.TRANSITION_DURATION;

      if (this.transitionOpacity >= 1) {
        this.transitionOpacity = 1;
        this.transitionPhase = "loading";
        this.loadTransitionTarget();
      }

      return;
    }

    if (this.transitionPhase === "fadeIn") {
      this.transitionOpacity -= deltaTime / Game.TRANSITION_DURATION;

      if (this.transitionOpacity <= 0) {
        this.transitionOpacity = 0;
        this.transitionPhase = "none";
        this.loadingMap = false;
        this.transitionTarget = undefined;
      }
    }
  }

  private loadTransitionTarget(): void {
    const target = this.transitionTarget;

    if (!target) {
      this.transitionPhase = "fadeIn";
      return;
    }

    void this.loadMap(
      target.id,
      target.spawnColumn,
      target.spawnRow,
      target.spawnDirection,
    ).then(() => {
      this.transitionPhase = "fadeIn";
    }).catch((error: unknown) => {
      this.transitionOpacity = 0;
      this.transitionPhase = "none";
      this.loadingMap = false;
      this.transitionTarget = undefined;

      throw error;
    });
  }
}
