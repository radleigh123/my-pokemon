import { AssetManager } from "@/engine/assets/AssetManager";
import { TileMap } from "@/engine/map/TileMap";
import { Music } from "@/audio/Music";

import littleroot from "@/assets/maps/littleroot.png";
import { Dialogue } from "@/dialogue/Dialogue";
import type { GameMap } from "@/engine/map/GameMap";
import type { MapObject } from "@/engine/map/MapObject";
import type { Warp } from "@/engine/map/Warp";
import { MapId } from "@/engine/map/MapManager";
import { createCollisionGrid } from "./data/LittlerootCollision";
import type { Sprite } from "@/engine/animation/Sprite";
import { Door } from "@/entities/Door";

export async function createLittleroot(assets: AssetManager, doorSprite: Sprite): Promise<GameMap> {
  const image = await assets.loadImage(littleroot);

  const warps: Warp[] = [
    {
      column: 9,
      row: 19,

      width: 16,
      height: 21,

      destination: MapId.Lab,

      spawnColumn: 7,
      spawnRow: 11.2,

      requiresDoorAnimation: true,
    },
    {
      column: 10,
      row: 0,

      width: 48,
      height: 16,

      destination: MapId.Route101,

      spawnColumn: 12,
      spawnRow: 18,
    },
  ];

  const tiles = createCollisionGrid();

  const objects: MapObject[] = [
    {
      x: 144,
      y: 128,
      width: 16,
      height: 16,
      solid: true,
      interactable: true,
      dialogue: new Dialogue("Sign", ["Littleroot Town", "Professor Birch's house."]),
    },
    {
      x: 224,
      y: 128,
      width: 16,
      height: 16,
      solid: true,
      interactable: true,
      dialogue: new Dialogue("Sign", ["Littleroot Town", "A friendly neighbor lives here."]),
    },
    {
      x: 128,
      y: 288,
      width: 16,
      height: 16,
      solid: true,
      interactable: true,
      dialogue: new Dialogue("Sign", ["Professor Birch's Pokemon Lab"]),
    },
    {
      x: 272,
      y: 208,
      width: 16,
      height: 16,
      solid: true,
      interactable: true,
      dialogue: new Dialogue("Sign", ["Littleroot Town", "A town that can't be shaded any hue."]),
    },
  ];

  const map = new TileMap(image, tiles, Music.LittlerootTown, warps);

  return {
    tileMap: map,
    npcs: [],
    objects,
    door: new Door(143, 263, doorSprite),
  };
}
