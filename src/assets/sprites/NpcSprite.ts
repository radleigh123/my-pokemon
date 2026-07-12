import { Sprite } from "@/engine/animation/Sprite";
import { Direction } from "@/entities/Direction";
import { AssetManager } from "@/engine/assets/AssetManager";

import down from "@/assets/npc/birch/down-16x20px-.png";
import up from "@/assets/npc/birch/up-16x20px.png";
import left from "@/assets/npc/birch/left-14x20px.png";
import right from "@/assets/npc/birch/right-14x20px.png";

import fatDown from "@/assets/npc/fat/down.png";
import fatUp from "@/assets/npc/fat/up.png";
import fatLeft from "@/assets/npc/fat/left.png";
import fatRight from "@/assets/npc/fat/right.png";

import kidDown from "@/assets/npc/kid/down.png";
import kidUp from "@/assets/npc/kid/up.png";
import kidLeft from "@/assets/npc/kid/left.png";
import kidRight from "@/assets/npc/kid/right.png";

import pikachuIdle from "@/assets/pokemon/pikachu/idle.png";

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

export async function createFatNpcSprite(assets: AssetManager): Promise<Sprite> {
  return new Sprite(
    new Map([
      [Direction.Down, [await assets.loadImage(fatDown)]],
      [Direction.Up, [await assets.loadImage(fatUp)]],
      [Direction.Left, [await assets.loadImage(fatLeft)]],
      [Direction.Right, [await assets.loadImage(fatRight)]],
    ]),
  );
}

export async function createKidNpcSprite(assets: AssetManager): Promise<Sprite> {
  return new Sprite(
    new Map([
      [Direction.Down, [await assets.loadImage(kidDown)]],
      [Direction.Up, [await assets.loadImage(kidUp)]],
      [Direction.Left, [await assets.loadImage(kidLeft)]],
      [Direction.Right, [await assets.loadImage(kidRight)]],
    ]),
  );
}

export async function createPikachuNpcSprite(assets: AssetManager): Promise<Sprite> {
  const idle = await assets.loadImage(pikachuIdle);

  return new Sprite(
    new Map([
      [Direction.Down, [idle]],
      [Direction.Up, [idle]],
      [Direction.Left, [idle]],
      [Direction.Right, [idle]],
    ]),
  );
}
