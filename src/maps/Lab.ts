import { AssetManager } from "@/engine/assets/AssetManager";
import { TileMap } from "@/engine/map/TileMap";

import lab from "@/assets/maps/lab-512x512px.png";
import { Music } from "@/audio/Music";
import { createCollisionGrid } from "./data/LabCollision";
import type { GameMap } from "../engine/map/GameMap";
import { createNpcSprite } from "@/assets/sprites/NpcSprite";
import { NPC } from "@/entities/NPC";
import { Dialogue } from "@/dialogue/Dialogue";
import { Direction } from "@/entities/Direction";
import { MapId } from "@/engine/map/MapManager";
import type { Warp } from "@/engine/map/Warp";

export async function createLab(assets: AssetManager): Promise<GameMap> {
  const image = await assets.loadImage(lab);

  if (image.height % TileMap.TILE_SIZE !== 0) {
    throw new Error(`Map height (${image.height}) must be divisible by ${TileMap.TILE_SIZE}.`);
  }

  if (image.width % TileMap.TILE_SIZE !== 0) {
    throw new Error(`Map width (${image.width}) must be divisible by ${TileMap.TILE_SIZE}.`);
  }

  const columns = image.width / TileMap.TILE_SIZE;
  const rows = image.height / TileMap.TILE_SIZE;

  const tiles = createCollisionGrid();

  const warps: Warp[] = [
    {
      column: 15,
      row: 22,

      width: 16,
      height: 16,

      destination: MapId.Littleroot,

      spawnColumn: 16,
      spawnRow: 24,
    },
  ];

  const map = new TileMap(image, columns, rows, tiles, Music.Lab, warps);

  const npcSprite = await createNpcSprite(assets);

  const npcs = [
    new NPC(
      240,
      224,
      npcSprite,
      new Dialogue("Professor Oak", [
        "This is Biiiiirrrccchhh!!!",
        "Choose my Poke-",
        "...",
        "I mean choose your starter pokemon.",
      ]),
      Direction.Down,
    ),
  ];

  return {
    tileMap: map,
    npcs,
  };
}
