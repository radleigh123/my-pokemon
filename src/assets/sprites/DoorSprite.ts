import { Sprite } from "@/engine/animation/Sprite";
import { Direction } from "@/entities/Direction";

import door1 from "@/assets/object/door/door-16-23px-1.png";
import door2 from "@/assets/object/door/door-16-23px-2.png";
import door3 from "@/assets/object/door/door-16-23px-3.png";
import door4 from "@/assets/object/door/door-16-23px-4.png";
import door5 from "@/assets/object/door/door-16-23px-5.png";
import door6 from "@/assets/object/door/door-16-23px-6.png";
import door7 from "@/assets/object/door/door-16-23px-7.png";

import type { AssetManager } from "@/engine/assets/AssetManager";

export async function createDoorSprite(assets: AssetManager): Promise<Sprite> {
  const [door1Image, door2Image, door3Image, door4Image, door5Image, door6Image, door7Image] =
    await Promise.all([
      assets.loadImage(door1),
      assets.loadImage(door2),
      assets.loadImage(door3),
      assets.loadImage(door4),
      assets.loadImage(door5),
      assets.loadImage(door6),
      assets.loadImage(door7),
    ]);

  return new Sprite(
    new Map([
      [
        Direction.Down,
        [door1Image, door2Image, door3Image, door4Image, door5Image, door6Image, door7Image],
      ],
    ]),
  );
}
