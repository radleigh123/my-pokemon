import { Renderer } from "../core/Renderer";
import { Camera } from "../core/Camera";

import { TileMap } from "../map/TileMap";

import { Player } from "@/entities/Player";
import { Entity } from "@/entities/Entity";
import { DialogueManager } from "@/dialogue/DialogueManager";
import { NPC } from "@/entities/NPC";

export class World {
  private readonly entities: Entity[];
  private readonly npcs: NPC[] = [];
  private readonly player: Player;
  private readonly dialogue = new DialogueManager();

  constructor(
    private readonly map: TileMap,
    player: Player,
    private readonly camera: Camera,
  ) {
    this.player = player;
    this.entities = [player, ...this.npcs];

    // player.setMapSize(map.getWidth(), map.getHeight());
  }

  public update(deltaTime: number): void {
    for (const entity of this.entities) {
      entity.update(deltaTime);
    }

    const next = this.player.getNextPosition();

    if (
      !this.map.isBlocked(
        next.x + (this.player.getCollisionX() - this.player.getX()),
        next.y + (this.player.getCollisionY() - this.player.getY()),
        this.player.getCollisionWidth(),
        this.player.getCollisionHeight(),
      )
    ) {
      this.player.setPosition(next.x, next.y);
    }
    // this.player.setPosition(next.x, next.y);

    this.camera.follow(
      this.player.getCollisionX() + this.player.getCollisionWidth() / 2,
      this.player.getCollisionY() + this.player.getCollisionHeight() / 2,
      this.map.getWidth(),
      this.map.getHeight(),
    );
  }

  public render(renderer: Renderer): void {
    renderer.setCamera(this.camera.getX(), this.camera.getY());

    // renderer.drawMap(this.map.getImage(), 0, 0);
    renderer.drawMapCentered(this.map.getImage())

    for (const entity of this.entities) {
      renderer.drawSprite(entity.getCurrentFrame(), entity.getX(), entity.getY());
    }

    renderer.drawRectangle(
      this.player.getCollisionX(),
      this.player.getCollisionY(),
      this.player.getCollisionWidth(),
      this.player.getCollisionHeight(),
    );
  }

  public interact(): void {
    const tile = this.player.getFacingTile();

    for (const npc of this.npcs) {
      if (npc.getX() === tile.x && npc.getY() === tile.y) {
        this.dialogue.start(npc.getDialogue());

        return;
      }
    }
  }

  public getDialogue(): DialogueManager {
    return this.dialogue;
  }
}
