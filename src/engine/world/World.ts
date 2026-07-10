import { Renderer } from "../core/Renderer";
import { Camera } from "../core/Camera";

import { TileMap } from "../map/TileMap";

import { Player } from "@/entities/Player";
import { Entity } from "@/entities/Entity";
import { DialogueManager } from "@/dialogue/DialogueManager";
import { NPC } from "@/entities/NPC";
import { Direction, opposite } from "@/entities/Direction";
import type { Warp } from "../map/Warp";
import type { Door } from "@/entities/Door";
import type { MapObject } from "../map/MapObject";
import { TileType } from "../map/TileType";

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class World {
  private readonly entities: Entity[];
  private readonly npcs: NPC[] = [];
  private readonly objects: MapObject[] = [];
  private readonly player: Player;
  private readonly dialogue = new DialogueManager();
  private readonly door?: Door;

  private pendingWarp?: Warp;
  private pendingWarpWaitsForDoor = false;

  constructor(
    private readonly map: TileMap,
    player: Player,
    npcs: NPC[],
    objects: MapObject[],
    door: Door | undefined,
    private readonly camera: Camera,
  ) {
    this.player = player;
    this.npcs = npcs;
    this.objects = objects;
    this.entities = [player, ...this.npcs];
    this.door = door;

    this.validateObjects();
    this.validateNpcs();
  }

  public update(deltaTime: number): void {
    if (this.dialogue.isActive()) {
      return;
    }

    this.door?.update(deltaTime);

    if (this.pendingWarp) {
      return;
    }

    for (const entity of this.entities) {
      entity.update(deltaTime);
    }

    if (this.player.isJumping()) {
      this.followPlayer();
      return;
    }

    const next = this.player.getNextPosition();

    const collisionX = next.x + (this.player.getCollisionX() - this.player.getX());
    const collisionY = next.y + (this.player.getCollisionY() - this.player.getY());
    const collisionWidth = this.player.getCollisionWidth();
    const collisionHeight = this.player.getCollisionHeight();

    if (this.shouldStartCliffJump(collisionX, collisionY, collisionWidth, collisionHeight)) {
      const targetX = this.player.getX();
      const targetY = this.player.getY() + TileMap.TILE_SIZE * 2;
      const targetCollisionX = targetX + (this.player.getCollisionX() - this.player.getX());
      const targetCollisionY = targetY + (this.player.getCollisionY() - this.player.getY());

      if (!this.isBlocked(targetCollisionX, targetCollisionY, collisionWidth, collisionHeight)) {
        this.player.startJump(targetX, targetY);
        this.followPlayer();
        return;
      }
    }

    const blocked = this.isBlocked(collisionX, collisionY, collisionWidth, collisionHeight);

    if (!blocked) {
      this.player.setPosition(next.x, next.y);
    }

    this.followPlayer();
  }

  public render(renderer: Renderer): void {
    renderer.setCamera(this.camera.getX(), this.camera.getY());

    renderer.drawMap(this.map);

    for (const object of this.objects) {
      if (object.layer === "below") {
        renderer.drawObject(object);
      }
    }

    const renderQueue: Array<Entity | MapObject> = [
      ...this.entities,
      ...this.objects.filter((object) => object.layer === undefined || object.layer === "normal"),
    ];

    renderQueue.sort((a, b) => {
      return this.getRenderBottom(a) - this.getRenderBottom(b);
    });

    for (const item of renderQueue) {
      if (item instanceof Entity) {
        renderer.drawSprite(item.getCurrentFrame(), item.getX(), item.getY());
      } else {
        renderer.drawObject(item);
      }
    }

    if (this.door) {
      renderer.drawDoor(this.door);
    }

    for (const object of this.objects) {
      if (object.layer === "above") {
        renderer.drawObject(object);
      }
    }
  }

  public interact(): boolean {
    if (this.dialogue.isActive()) {
      this.dialogue.next();
      return true;
    }

    if (this.pendingWarp) {
      return false;
    }

    if (this.player.isJumping()) {
      return false;
    }

    const interactionArea = this.getPlayerFacingRectangle();

    const warp = this.map.getWarp(
      interactionArea.x,
      interactionArea.y,
      interactionArea.width,
      interactionArea.height,
    );

    if (warp && this.player.canWarp()) {
      this.queueWarp(warp);
      return true;
    }

    for (const npc of this.npcs) {
      if (this.rectanglesIntersect(
        interactionArea.x,
        interactionArea.y,
        interactionArea.width,
        interactionArea.height,
        npc.getCollisionX(),
        npc.getCollisionY(),
        npc.getCollisionWidth(),
        npc.getCollisionHeight(),
      )) {
        npc.face(opposite(this.player.getDirection()));
        this.dialogue.start(npc.getDialogue());
        return true;
      }
    }

    for (const object of this.objects) {
      if (!object.interactable || (!object.dialogue && !object.onInteract)) {
        continue;
      }

      if (this.rectanglesIntersect(
        interactionArea.x,
        interactionArea.y,
        interactionArea.width,
        interactionArea.height,
        object.x,
        object.y,
        object.width,
        object.height,
      )) {
        object.onInteract?.();

        if (object.dialogue) {
          this.dialogue.start(object.dialogue);
        }

        return true;
      }
    }

    return false;
  }

  public isBlocked(x: number, y: number, width: number, height: number): boolean {
    return (
      this.map.isBlocked(x, y, width, height) ||
      this.isObjectBlocked(x, y, width, height) ||
      this.isNpcBlocked(x, y, width, height)
    );
  }

  private shouldStartCliffJump(x: number, y: number, width: number, height: number): boolean {
    return (
      this.player.getDirection() === Direction.Down &&
      this.map.rectangleOverlapsTileType(x, y, width, height, TileType.Cliff)
    );
  }

  private followPlayer(): void {
    this.camera.follow(
      this.player.getCollisionX() + this.player.getCollisionWidth() / 2,
      this.player.getCollisionY() + this.player.getCollisionHeight() / 2,
      this.map.getPixelWidth(),
      this.map.getPixelHeight(),
    );
  }

  private isObjectBlocked(x: number, y: number, width: number, height: number): boolean {
    return this.objects.some((object) => {
      return object.solid === true && this.rectanglesIntersect(
        x,
        y,
        width,
        height,
        object.x,
        object.y,
        object.width,
        object.height,
      );
    });
  }

  private isNpcBlocked(x: number, y: number, width: number, height: number): boolean {
    return this.npcs.some((npc) => {
      return this.rectanglesIntersect(
        x,
        y,
        width,
        height,
        npc.getCollisionX(),
        npc.getCollisionY(),
        npc.getCollisionWidth(),
        npc.getCollisionHeight(),
      );
    });
  }

  private rectanglesIntersect(
    aX: number,
    aY: number,
    aWidth: number,
    aHeight: number,
    bX: number,
    bY: number,
    bWidth: number,
    bHeight: number,
  ): boolean {
    return (
      aX < bX + bWidth &&
      aX + aWidth > bX &&
      aY < bY + bHeight &&
      aY + aHeight > bY
    );
  }

  private getPlayerFacingRectangle(): Rectangle {
    const x = this.player.getCollisionX();
    const y = this.player.getCollisionY();
    const width = this.player.getCollisionWidth();
    const height = this.player.getCollisionHeight();

    switch (this.player.getDirection()) {
      case Direction.Up:
        return { x, y: y - TileMap.TILE_SIZE, width, height: TileMap.TILE_SIZE };

      case Direction.Down:
        return { x, y: y + height, width, height: TileMap.TILE_SIZE };

      case Direction.Left:
        return { x: x - TileMap.TILE_SIZE, y, width: TileMap.TILE_SIZE, height };

      case Direction.Right:
        return { x: x + width, y, width: TileMap.TILE_SIZE, height };
    }
  }

  private getRenderBottom(item: Entity | MapObject): number {
    if (item instanceof Entity) {
      return item.getCollisionY() + item.getCollisionHeight();
    }

    return item.y + item.height;
  }

  public getDialogue(): DialogueManager {
    return this.dialogue;
  }

  public getTileMap(): TileMap {
    return this.map;
  }

  public getPlayerTile(): TileType {
    return this.map.getTile(
      this.player.getCollisionX() + this.player.getCollisionWidth() / 2,
      this.player.getCollisionY() + this.player.getCollisionHeight() / 2,
    );
  }

  public getPendingWarp(): Warp | null {
    if (this.pendingWarp) {
      if (this.pendingWarpWaitsForDoor && !this.door?.isFinished()) {
        return null;
      }

      const warp = this.pendingWarp;
      this.pendingWarp = undefined;
      this.pendingWarpWaitsForDoor = false;

      return warp;
    }

    if (!this.player.canWarp()) {
      return null;
    }

    if (this.player.isJumping()) {
      return null;
    }

    const warp = this.map.getWarp(
      this.player.getCollisionX(),
      this.player.getCollisionY(),
      this.player.getCollisionWidth(),
      this.player.getCollisionHeight(),
    );

    if (!warp) {
      return null;
    }

    if (!warp.requiresDoorAnimation || !this.door) {
      return warp;
    }

    this.queueWarp(warp);

    return null;
  }

  private queueWarp(warp: Warp): void {
    this.pendingWarp = warp;
    this.pendingWarpWaitsForDoor = warp.requiresDoorAnimation === true && this.door !== undefined;

    if (this.pendingWarpWaitsForDoor) {
      this.door?.open();
    }
  }

  private validateObjects(): void {
    for (const object of this.objects) {
      if (
        object.width <= 0 ||
        object.height <= 0 ||
        object.x < 0 ||
        object.y < 0 ||
        object.x + object.width > this.map.getPixelWidth() ||
        object.y + object.height > this.map.getPixelHeight()
      ) {
        throw new Error(
          `Map object at ${object.x},${object.y} (${object.width}x${object.height}) ` +
            `does not fit inside map ${this.map.getPixelWidth()}x${this.map.getPixelHeight()}.`,
        );
      }
    }
  }

  private validateNpcs(): void {
    for (const npc of this.npcs) {
      if (
        npc.getCollisionWidth() <= 0 ||
        npc.getCollisionHeight() <= 0 ||
        npc.getCollisionX() < 0 ||
        npc.getCollisionY() < 0 ||
        npc.getCollisionX() + npc.getCollisionWidth() > this.map.getPixelWidth() ||
        npc.getCollisionY() + npc.getCollisionHeight() > this.map.getPixelHeight()
      ) {
        throw new Error(
          `NPC at ${npc.getX()},${npc.getY()} ` +
            `does not fit inside map ${this.map.getPixelWidth()}x${this.map.getPixelHeight()}.`,
        );
      }
    }
  }
}
