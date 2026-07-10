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
import { Direction } from "@/entities/Direction";

export async function createLittleroot(assets: AssetManager, doorSprite: Sprite): Promise<GameMap> {
  const image = await assets.loadImage(littleroot);

  const warps: Warp[] = [
    {
      column: 9,
      row: 16,

      width: 16,
      height: 16,

      destination: MapId.Lab,

      spawnColumn: 7,
      spawnRow: 11.2,

      requiresDoorAnimation: true,
      entryDirection: Direction.Up,
    },
    {
      column: 12,
      row: 0,

      width: 32,
      height: 16,

      destination: MapId.Route101,

      spawnColumn: 12,
      spawnRow: 18,
    },
  ];

  const tiles = createCollisionGrid();

  const map = new TileMap(image, tiles, Music.LittlerootTown, warps, {
    collisionHeight: 352,
    collisionOffsetY: 7,
  });

  const objects: MapObject[] = [
    {
      x: map.getTilePixelX(9),
      y: map.getTilePixelY(8),
      width: 16,
      height: 16,
      solid: true,
      interactable: true,
      dialogue: new Dialogue("Sign", ["Littleroot Town", "Professor Birch's house."]),
    },
    {
      x: map.getTilePixelX(14),
      y: map.getTilePixelY(8),
      width: 16,
      height: 16,
      solid: true,
      interactable: true,
      dialogue: new Dialogue("Sign", ["Littleroot Town", "A friendly neighbor lives here."]),
    },
    {
      x: map.getTilePixelX(8),
      y: map.getTilePixelY(17),
      width: 16,
      height: 16,
      solid: true,
      interactable: true,
      dialogue: new Dialogue("Sign", ["Professor Birch's Pokemon Lab"]),
    },
    {
      x: map.getTilePixelX(17),
      y: map.getTilePixelY(13),
      width: 16,
      height: 16,
      solid: true,
      interactable: true,
      dialogue: new Dialogue("Sign", ["Littleroot Town", "A town that can't be shaded any hue."]),
    },
  ];

  return {
    tileMap: map,
    npcs: [],
    objects,
    door: new Door(143, map.getTilePixelY(16), doorSprite),
  };
}
