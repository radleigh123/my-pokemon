import type { Sprite } from "../animation/Sprite";
import { AssetManager } from "../assets/AssetManager";

import type { GameMap } from "./GameMap";

import { createLab } from "@/maps/Lab";
import { createLittleroot } from "@/maps/Littleroot";

export enum MapId {
  Lab,
  Littleroot,
}

export class MapManager {
  constructor(
    private readonly assets: AssetManager,
    private readonly doorSprite: Sprite,
  ) {}

  public async load(id: MapId): Promise<GameMap> {
    switch (id) {
      case MapId.Lab:
        return await createLab(this.assets);

      case MapId.Littleroot:
        return await createLittleroot(this.assets, this.doorSprite);

      default:
        throw new Error(`Unknown map ${id}`);
    }
  }
}
