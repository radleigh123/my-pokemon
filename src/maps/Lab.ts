import { AssetManager } from "@/engine/assets/AssetManager";
import { TileMap } from "@/engine/map/TileMap";

import lab from "@/assets/maps/littleroot/lab.png";
import { Music } from "@/audio/Music";
import { createCollisionGrid } from "./data/LabCollision";
import type { GameMap } from "../engine/map/GameMap";
import { createNpcSprite } from "@/assets/sprites/NpcSprite";
import { NPC } from "@/entities/NPC";
import { Dialogue } from "@/dialogue/Dialogue";
import { Direction } from "@/entities/Direction";
import { MapId } from "@/engine/map/MapManager";
import type { Warp } from "@/engine/map/Warp";
import { storyProgress } from "@/story/StoryProgress";

export async function createLab(assets: AssetManager): Promise<GameMap> {
  const image = await assets.loadImage(lab);

  const tiles = createCollisionGrid();

  const warps: Warp[] = [
    {
      column: 6,
      row: 12.6,

      width: 16,
      height: 5,

      destination: MapId.Littleroot,

      spawnColumn: 9,
      spawnRow: 17.5,
    },
    {
      column: 7,
      row: 12.6,

      width: 16,
      height: 5,

      destination: MapId.Littleroot,

      spawnColumn: 9,
      spawnRow: 17.5,
    },
  ];

  const map = new TileMap(image, tiles, Music.Lab, warps);
  map.setSpawn(7, 11.2);

  const npcSprite = await createNpcSprite(assets);

  const npcs = [
    new NPC(
      96,
      64,
      npcSprite,
      () => new Dialogue(
        "Professor Birch",
        storyProgress.isMenuUnlocked
          ? [
            "Let me fix that pokedex real quick.",
            "....",
            "....",
            "....",
            "....",
            "You can now access the pokedex through the menu (Press ENTER)"
          ]
          : [
            "Welcome to our Littleroot town. My name is Professor Birch Tree.",
            "You're probably wondering, where's the starter pokemons?",
            "Well...",
            "There isn't, the developer of this game got tired and went on a different path, the shab-",
            "...the good path",
            "I need you to find the kid that borrowed the POKeDEX."
          ],
      ),
      Direction.Down,
      () => {
        if (storyProgress.hasReceivedPokedexFromKid) {
          storyProgress.isMenuUnlocked = true;
          return;
        }

        storyProgress.hasTalkedToBirchIntro = true;
      },
    ),
  ];

  return {
    tileMap: map,
    npcs,
  };
}
