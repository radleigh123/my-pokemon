import { Sprite } from "@/engine/animation/Sprite";
import { Direction } from "@/entities/Direction";

import down1 from "@/assets/player/down/idle.png";
import down2 from "../player/down/walk1.png";
import down3 from "../player/down/walk2.png";

import up1 from "../player/up/idle.png";
import up2 from "../player/up/walk1.png";
import up3 from "../player/up/walk2.png";

import left1 from "../player/left/idle.png";
import left2 from "../player/left/walk1.png";
import left3 from "../player/left/walk2.png";

import right1 from "../player/right/idle.png";
import right2 from "../player/right/walk1.png";
import right3 from "../player/right/walk2.png";
import type { AssetManager } from "@/engine/assets/AssetManager";

export async function createPlayerSprite(assets: AssetManager): Promise<Sprite> {
  const [
    down1Image,
    down2Image,
    down3Image,
    up1Image,
    up2Image,
    up3Image,
    left1Image,
    left2Image,
    left3Image,
    right1Image,
    right2Image,
    right3Image,
  ] = await Promise.all([
    assets.loadImage(down1),
    assets.loadImage(down2),
    assets.loadImage(down3),
    assets.loadImage(up1),
    assets.loadImage(up2),
    assets.loadImage(up3),
    assets.loadImage(left1),
    assets.loadImage(left2),
    assets.loadImage(left3),
    assets.loadImage(right1),
    assets.loadImage(right2),
    assets.loadImage(right3),
  ]);

  console.log(down1Image.width, down1Image.height);

  return new Sprite(
    new Map([
      [Direction.Down, [down1Image, down2Image, down3Image]],
      [Direction.Up, [up1Image, up2Image, up3Image]],
      [Direction.Left, [left1Image, left2Image, left3Image]],
      [Direction.Right, [right1Image, right2Image, right3Image]],
    ]),
  );
}
