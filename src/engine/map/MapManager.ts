import type { Sprite } from "../animation/Sprite";
import { AssetManager } from "../assets/AssetManager";

import type { GameMap } from "./GameMap";

import { createLab } from "@/maps/Lab";
import { createLittleroot } from "@/maps/Littleroot";
import { createRoute101 } from "@/maps/Route101";
import {
  createHouse1Floor1,
  createHouse1Floor2,
  createHouse2Floor1,
  createHouse2Floor2,
} from "@/maps/Houses";

export enum MapId {
  Lab,
  Littleroot,
  Route101,
  House1Floor1,
  House1Floor2,
  House2Floor1,
  House2Floor2,
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

      case MapId.Route101:
        return await createRoute101(this.assets);

      case MapId.House1Floor1:
        return await createHouse1Floor1(this.assets);

      case MapId.House1Floor2:
        return await createHouse1Floor2(this.assets);

      case MapId.House2Floor1:
        return await createHouse2Floor1(this.assets);

      case MapId.House2Floor2:
        return await createHouse2Floor2(this.assets);

      default:
        throw new Error(`Unknown map ${id}`);
    }
  }
}
