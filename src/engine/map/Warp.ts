import type { MapId } from "./MapManager";

export interface Warp {
  readonly column: number;
  readonly row: number;

  readonly width: number;
  readonly height: number;

  readonly destination: MapId;

  readonly spawnColumn: number;
  readonly spawnRow: number;

  readonly requiresDoorAnimation?: boolean;
}
