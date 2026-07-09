import type { Dialogue } from "@/dialogue/Dialogue";
import type { Sprite } from "@/engine/animation/Sprite";

export type RenderLayer = "below" | "normal" | "above";

export interface MapObject {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly sprite?: Sprite;
  readonly solid?: boolean;
  readonly interactable?: boolean;
  readonly dialogue?: Dialogue;
  readonly onInteract?: () => void;
  readonly layer?: RenderLayer;
}
