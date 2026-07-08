import { Sprite } from "@/engine/animation/Sprite";
import { Direction } from "@/entities/Direction";
import { AssetManager } from "@/engine/assets/AssetManager";

import down from "@/assets/npc/birch/down-16x20px-.png";
import up from "@/assets/npc/birch/up-16x20px.png";
import left from "@/assets/npc/birch/left-14x20px.png";
import right from "@/assets/npc/birch/right-14x20px.png";

export async function createNpcSprite(assets: AssetManager): Promise<Sprite> {
  return new Sprite(
    new Map([
      [Direction.Down, [await assets.loadImage(down)]],
      [Direction.Up, [await assets.loadImage(up)]],
      [Direction.Left, [await assets.loadImage(left)]],
      [Direction.Right, [await assets.loadImage(right)]],
    ]),
  );
}
