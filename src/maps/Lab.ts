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

  const map = new TileMap(image, columns, rows, tiles, Music.Lab);

  const npcSprite = await createNpcSprite(assets);

  const npcs = [
    new NPC(
      240,
      220,
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
