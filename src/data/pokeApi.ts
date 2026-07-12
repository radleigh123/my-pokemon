import type { PokedexPlaceholderEntry } from "./pokedexPlaceholders";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

interface PokeApiNamedResource {
  name: string;
  url: string;
}

interface PokeApiPokedexResponse {
  pokemon_entries: Array<{
    entry_number: number;
    pokemon_species: PokeApiNamedResource;
  }>;
}

interface PokeApiPokemonResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    versions?: {
      "generation-v"?: {
        "black-white"?: {
          animated?: {
            front_default: string | null;
          };
        };
      };
      "generation-iii"?: {
        emerald?: {
          front_default: string | null;
        };
        "ruby-sapphire"?: {
          front_default: string | null;
        };
      };
    };
  };
}

interface PokeApiSpeciesResponse {
  id: number;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: PokeApiNamedResource;
    version: PokeApiNamedResource;
  }>;
  genera: Array<{
    genus: string;
    language: PokeApiNamedResource;
  }>;
}

export async function fetchPokedexNames(
  limit: number,
): Promise<Array<Pick<PokedexPlaceholderEntry, "id" | "name" | "apiName">>> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokedex/hoenn`);

  if (!response.ok) {
    throw new Error(`Failed to load Hoenn Pokedex: ${response.status}`);
  }

  const data = (await response.json()) as PokeApiPokedexResponse;

  return data.pokemon_entries.slice(0, limit).map((entry) => ({
    id: entry.entry_number,
    name: formatPokemonName(entry.pokemon_species.name),
    apiName: entry.pokemon_species.name,
  }));
}

export async function fetchPokedexEntry(entry: PokedexPlaceholderEntry): Promise<Partial<PokedexPlaceholderEntry>> {
  const identifier = entry.apiName ?? entry.id;
  const [pokemon, species] = await Promise.all([
    fetchJson<PokeApiPokemonResponse>(`${POKEAPI_BASE_URL}/pokemon/${identifier}`),
    fetchJson<PokeApiSpeciesResponse>(`${POKEAPI_BASE_URL}/pokemon-species/${identifier}`),
  ]);

  return {
    id: entry.id,
    name: formatPokemonName(pokemon.name),
    seen: true,
    owned: false,
    height: formatHeight(pokemon.height),
    weight: formatWeight(pokemon.weight),
    category: getCategory(species),
    description: getDescription(species),
    apiName: pokemon.name,
    sprite: getSprite(pokemon),
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }

  return (await response.json()) as T;
}

function getSprite(pokemon: PokeApiPokemonResponse): string | undefined {
  return (
    pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default ??
    pokemon.sprites.versions?.["generation-iii"]?.emerald?.front_default ??
    pokemon.sprites.versions?.["generation-iii"]?.["ruby-sapphire"]?.front_default ??
    pokemon.sprites.front_default ??
    undefined
  );
}

function getCategory(species: PokeApiSpeciesResponse): string {
  const genus = species.genera.find((entry) => entry.language.name === "en")?.genus;

  if (!genus) {
    return "?????";
  }

  return genus.replace(/\s+Pokémon$/u, "");
}

function getDescription(species: PokeApiSpeciesResponse): string {
  const preferredVersions = ["emerald", "ruby", "sapphire"];
  const englishEntries = species.flavor_text_entries.filter((entry) => entry.language.name === "en");
  const preferredEntry =
    preferredVersions
      .map((version) => englishEntries.find((entry) => entry.version.name === version))
      .find(Boolean) ?? englishEntries[0];

  return preferredEntry?.flavor_text.replace(/\f|\n|\r/gu, " ").replace(/\s+/gu, " ").trim() ?? "No data available.";
}

function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatHeight(decimeters: number): string {
  const inches = Math.round(decimeters * 3.93701);
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;

  return `${feet}'${String(remainingInches).padStart(2, "0")}"`;
}

function formatWeight(hectograms: number): string {
  const pounds = hectograms * 0.220462;

  return `${pounds.toFixed(1)} lbs.`;
}
