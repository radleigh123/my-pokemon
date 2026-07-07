import { Renderer } from "../core/Renderer";
import { Camera } from "../core/Camera";

import { TileMap } from "../map/TileMap";

import { Player } from "@/entities/Player";
import { Entity } from "@/entities/Entity";

export class World {
  private readonly entities: Entity[];

  constructor(
    private readonly map: TileMap,
    player: Player,
    private readonly camera: Camera,
  ) {
    this.entities = [player];
  }

  public update(deltaTime: number): void {
    for (const entity of this.entities) {
      entity.update(deltaTime);
    }

    const player = this.entities[0];

    this.camera.follow(player!.getX(), player!.getY());
  }

  public render(renderer: Renderer): void {
    renderer.drawMap(this.map.getImage(), 0, 0, this.camera.getX(), this.camera.getY());

    for (const entity of this.entities) {
      renderer.drawSprite(
        entity.getCurrentFrame(),
        entity.getX(),
        entity.getY(),
        this.camera.getX(),
        this.camera.getY(),
      );
    }
  }
}
