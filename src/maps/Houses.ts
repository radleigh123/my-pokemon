import { Music } from "@/audio/Music";
import { AssetManager } from "@/engine/assets/AssetManager";
import type { GameMap } from "@/engine/map/GameMap";
import { MapId } from "@/engine/map/MapManager";
import { TileMap } from "@/engine/map/TileMap";
import type { Warp } from "@/engine/map/Warp";
import { Direction } from "@/entities/Direction";

import house1Floor1 from "@/assets/maps/littleroot/house1-floor1-176x144.png";
import house1Floor2 from "@/assets/maps/littleroot/house1-floor2-144x128.png";
import house2Floor1 from "@/assets/maps/littleroot/house2-floor1-176x144.png";
import house2Floor2 from "@/assets/maps/littleroot/house2-floor2-144x128.png";
import {
  createHouse1Floor1CollisionGrid,
  createHouse1Floor2CollisionGrid,
  createHouse2Floor1CollisionGrid,
  createHouse2Floor2CollisionGrid,
} from "./data/HouseCollision";

export async function createHouse1Floor1(assets: AssetManager): Promise<GameMap> {
  const image = await assets.loadImage(house1Floor1);
  const tiles = createHouse1Floor1CollisionGrid();
  const warps: Warp[] = [
    {
      column: 8,
      row: 8.65,
      width: 32,
      height: 5,
      destination: MapId.Littleroot,
      spawnColumn: 7,
      spawnRow: 9,
    },
    {
      column: 8,
      row: 2,
      width: 16,
      height: 16,
      destination: MapId.House1Floor2,
      spawnColumn: 7,
      spawnRow: 2,
      requiresEntryAnimation: true,
      entryDirection: Direction.Up,
      spawnDirection: Direction.Down,
    },
  ];

  const map = new TileMap(image, tiles, Music.LittlerootTown, warps);
  map.setSpawn(8.5, 7);

  return {
    tileMap: map,
    npcs: [],
  };
}

export async function createHouse1Floor2(assets: AssetManager): Promise<GameMap> {
  const image = await assets.loadImage(house1Floor2);
  const tiles = createHouse1Floor2CollisionGrid();
  const warps: Warp[] = [
    {
      column: 7,
      row: 1,
      width: 16,
      height: 16,
      destination: MapId.House1Floor1,
      spawnColumn: 8,
      spawnRow: 3,
      requiresEntryAnimation: true,
      entryDirection: Direction.Up,
    },
  ];

  const map = new TileMap(image, tiles, Music.LittlerootTown, warps);
  map.setSpawn(7, 1);

  return {
    tileMap: map,
    npcs: [],
  };
}

export async function createHouse2Floor1(assets: AssetManager): Promise<GameMap> {
  const image = await assets.loadImage(house2Floor1);
  const tiles = createHouse2Floor1CollisionGrid();
  const warps: Warp[] = [
    {
      column: 1,
      row: 8.65,
      width: 32,
      height: 5,
      destination: MapId.Littleroot,
      spawnColumn: 16,
      spawnRow: 9,
    },
    {
      column: 2,
      row: 2,
      width: 16,
      height: 16,
      destination: MapId.House2Floor2,
      spawnColumn: 1,
      spawnRow: 2,
      requiresEntryAnimation: true,
      entryDirection: Direction.Up,
      spawnDirection: Direction.Down,
    },
  ];

  const map = new TileMap(image, tiles, Music.LittlerootTown, warps);
  map.setSpawn(1.5, 7);

  return {
    tileMap: map,
    npcs: [],
  };
}

export async function createHouse2Floor2(assets: AssetManager): Promise<GameMap> {
  const image = await assets.loadImage(house2Floor2);
  const tiles = createHouse2Floor2CollisionGrid();
  const warps: Warp[] = [
    {
      column: 1,
      row: 1,
      width: 16,
      height: 16,
      destination: MapId.House2Floor1,
      spawnColumn: 2,
      spawnRow: 3,
      requiresEntryAnimation: true,
      entryDirection: Direction.Up,
    },
  ];

  const map = new TileMap(image, tiles, Music.LittlerootTown, warps);
  map.setSpawn(1, 1);

  return {
    tileMap: map,
    npcs: [],
  };
}
