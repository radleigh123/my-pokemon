import { Music } from "@/audio/Music";
import { Dialogue } from "@/dialogue/Dialogue";
import { AssetManager } from "@/engine/assets/AssetManager";
import type { GameMap } from "@/engine/map/GameMap";
import { MapId } from "@/engine/map/MapManager";
import type { MapObject } from "@/engine/map/MapObject";
import { TileMap } from "@/engine/map/TileMap";
import type { Warp } from "@/engine/map/Warp";
import { Direction } from "@/entities/Direction";
import { NPC } from "@/entities/NPC";
import { createKidNpcSprite } from "@/assets/sprites/NpcSprite";
import { storyProgress } from "@/story/StoryProgress";

import route101 from "@/assets/maps/route101-383x318.png";
import { createCollisionGrid } from "./data/Route101Collision";

export async function createRoute101(assets: AssetManager): Promise<GameMap> {
  const image = await assets.loadImage(route101);

  const warps: Warp[] = [
    {
      column: 12,
      row: 19,
      width: 32,
      height: 9,
      destination: MapId.Littleroot,
      spawnColumn: 12,
      spawnRow: 3,
    },
  ];

  const tiles = createCollisionGrid();
  const map = new TileMap(image, tiles, Music.Route1, warps, {
    collisionHeight: 313,
    collisionOffsetY: 5,
  });
  map.setSpawn(12, 18);

  const objects: MapObject[] = [
    {
      x: map.getTilePixelX(7),
      y: map.getTilePixelY(9),
      width: TileMap.TILE_SIZE,
      height: TileMap.TILE_SIZE,
      solid: true,
      interactable: true,
      dialogue: new Dialogue("Sign", ["Route 101"]),
    },
  ];

  const kidSprite = await createKidNpcSprite(assets);
  const npcs = [
    new NPC(
      map.getTilePixelX(7),
      map.getTilePixelY(2),
      kidSprite,
      new Dialogue("Kid", [
        "Your team destroyed the turret.",
        "Our turret is under attack.",
        "Okay here's thee POKeDEX.",
        "Go to the professor, to fix the pokedex",
      ]),
      Direction.Down,
      () => {
        storyProgress.hasReceivedPokedexFromKid = true;
      },
    ),
  ];

  return {
    tileMap: map,
    npcs,
    objects,
  };
}
