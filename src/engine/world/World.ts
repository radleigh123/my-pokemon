import { Renderer } from "../core/Renderer";
import { Camera } from "../core/Camera";

import { TileMap } from "../map/TileMap";

import { Player } from "@/entities/Player";
import { Entity } from "@/entities/Entity";
import { DialogueManager } from "@/dialogue/DialogueManager";
import { Sprite } from "../animation/Sprite";
import { NPC } from "@/entities/NPC";
import { Dialogue } from "@/dialogue/Dialogue";
import { opposite } from "@/entities/Direction";

export class World {
  private readonly entities: Entity[];
  private readonly npcs: NPC[] = [];
  private readonly player: Player;
  private readonly dialogue = new DialogueManager();

  constructor(
    private readonly map: TileMap,
    player: Player,
    npcSprite: Sprite,
    private readonly camera: Camera,
  ) {
    this.player = player;
    this.npcs = [
      new NPC(
        96,
        64,
        npcSprite,
        new Dialogue("Professor Oak", [
          "This is Biiiiirrrccchhh!!!",
          "Choose my Poke-",
          "...",
          "I mean choose your starter pokemon.",
        ]),
      ),
    ];
    this.entities = [player, ...this.npcs];

    // player.setMapSize(map.getWidth(), map.getHeight());
  }

  public update(deltaTime: number): void {
    if (this.dialogue.isActive()) {
      return;
    }

    for (const entity of this.entities) {
      entity.update(deltaTime);
    }

    const next = this.player.getNextPosition();

    const collisionX = next.x + (this.player.getCollisionX() - this.player.getX());
    const collisionY = next.y + (this.player.getCollisionY() - this.player.getY());

    const blocked = this.map.isBlocked(
      collisionX,
      collisionY,
      this.player.getCollisionWidth(),
      this.player.getCollisionHeight(),
    );

    console.log({
      nextX: next.x,
      nextY: next.y,
      collisionX,
      collisionY,
      blocked,
    });

    if (!blocked) {
      console.log("SETTING", next.y);

      this.player.setPosition(next.x, next.y);

      console.log("PLAYER", this.player.getY());
    }

    this.camera.follow(
      this.player.getCollisionX() + this.player.getCollisionWidth() / 2,
      this.player.getCollisionY() + this.player.getCollisionHeight() / 2,
      this.map.getPixelWidth(),
      this.map.getPixelHeight(),
    );
  }

  public render(renderer: Renderer): void {
    renderer.setCamera(this.camera.getX(), this.camera.getY());

    renderer.drawMap(this.map);

    // Collision drawing
    renderer.drawCollision(this.map);

    const renderQueue = [...this.entities];

    renderQueue.sort((a, b) => {
      return (
        a.getCollisionY() + a.getCollisionHeight() - (b.getCollisionY() + b.getCollisionHeight())
      );
    });

    for (const entity of renderQueue) {
      renderer.drawSprite(entity.getCurrentFrame(), entity.getX(), entity.getY());
    }

    renderer.drawRectangle(
      this.player.getCollisionX(),
      this.player.getCollisionY(),
      this.player.getCollisionWidth(),
      this.player.getCollisionHeight(),
    );
    renderer.drawPoint(this.player.getX(), this.player.getY());
  }

  public interact(): boolean {
    if (this.dialogue.isActive()) {
      this.dialogue.next();
      return true;
    }

    const tile = this.player.getFacingTile();

    for (const npc of this.npcs) {
      const npcColumn = Math.floor(npc.getCollisionX() / 16);
      const npcRow = Math.floor(npc.getCollisionY() / 16);

      const targetColumn = Math.floor(tile.x / 16);
      const targetRow = Math.floor(tile.y / 16);

      if (npcColumn === targetColumn && npcRow === targetRow) {
        npc.face(opposite(this.player.getDirection()));
        this.dialogue.start(npc.getDialogue());
        return true;
      }
    }

    return false;
  }

  public getDialogue(): DialogueManager {
    return this.dialogue;
  }
}
