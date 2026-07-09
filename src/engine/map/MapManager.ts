import { AssetManager } from "../assets/AssetManager";

import type { GameMap } from "./GameMap";

import { createLab } from "@/maps/Lab";
import { createLittleroot } from "@/maps/LittleRoot";

export enum MapId {
  Lab,
  Littleroot,
}

export class MapManager {
  constructor(private readonly assets: AssetManager) {}

  public async load(id: MapId): Promise<GameMap> {
    switch (id) {
      case MapId.Lab:
        return await createLab(this.assets);

      // case MapId.Littleroot:
      //   return await createLittleroot(this.assets);
      case MapId.Littleroot: {
        const map = await createLittleroot(this.assets);
        console.log("MapManager:", map);
        return map;
      }

      default:
        throw new Error(`Unknown map ${id}`);
    }
  }
}
