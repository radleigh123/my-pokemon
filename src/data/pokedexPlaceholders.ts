export interface PokedexPlaceholderEntry {
  id: number;
  name: string;
  seen: boolean;
  owned: boolean;
  height: string;
  weight: string;
  category: string;
  description: string;
  color?: string;
  types?: string[];
  heightValue?: number;
  weightValue?: number;
  apiName?: string;
  sprite?: string;
}

export const POKEDEX_ENTRY_COUNT = 202;

export function createPokedexPlaceholder(id: number): PokedexPlaceholderEntry {
  return {
    id,
    name: "?????",
    seen: false,
    owned: false,
    height: "??'??\"",
    weight: "???.? lbs.",
    category: "?????",
    description: "No data available.",
  };
}

export const pokedexPlaceholders: PokedexPlaceholderEntry[] = Array.from(
  { length: POKEDEX_ENTRY_COUNT },
  (_, index) => createPokedexPlaceholder(index + 1),
);
