<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import dashboard from "@/assets/UI/pokedex/pokedex-dashboard.png";
import arrowDown from "@/assets/UI/pokedex/pokedex-dashboard-arrow-down.png";
import arrowUp from "@/assets/UI/pokedex/pokedex-dashboard-arrow-up.png";
import detailTopbar from "@/assets/UI/pokedex/pokedex-pokemon-view-topbar.png";
import detailBackground from "@/assets/UI/pokedex/pokedex-pokemon-view.png";
import searchBackground from "@/assets/UI/pokedex/pokedex-search.png";
import { fetchPokedexEntry, fetchPokedexNames } from "@/data/pokeApi";
import { pokedexPlaceholders, type PokedexPlaceholderEntry } from "@/data/pokedexPlaceholders";

const props = defineProps<{
  selectedIndex: number
  searchIndex: number
  searchMode: "fields" | "name" | "color" | "type" | "order"
  searchOptionIndex: number
  searchTypeSlot: 1 | 2
  searchFilters: {
    nameGroup: string
    color: string
    type1: string
    type2: string
    order: string
  }
  view: "list" | "detail" | "search"
}>();

const emit = defineEmits<{
  (event: "filtered-count-change", count: number): void
}>();

const NATIVE_WIDTH = 240;
const NATIVE_HEIGHT = 160;
const LIST_WINDOW_CENTER_INDEX = 5;
const LIST_WINDOW_SIZE = 14;
const searchRows = [
  { label: "NAME", field: "nameGroup" },
  { label: "COLOR", field: "color" },
  { label: "TYPE", field: "type" },
  { label: "ORDER", field: "order" },
  { label: "OK", field: "ok" },
];
const searchOptions = {
  name: ["DON'T SPECIFY", "ABC", "DEF", "GHI", "JKL", "MNO", "PQR", "STU", "VWX", "YZ"],
  color: ["DON'T SPECIFY", "BLACK", "BLUE", "BROWN", "GRAY", "GREEN", "PINK", "PURPLE", "RED", "WHITE", "YELLOW"],
  type: [
    "DON'T SPECIFY",
    "NORMAL",
    "FIRE",
    "WATER",
    "ELECTRIC",
    "GRASS",
    "ICE",
    "FIGHTING",
    "POISON",
    "GROUND",
    "FLYING",
    "PSYCHIC",
    "BUG",
    "ROCK",
    "GHOST",
    "DRAGON",
    "DARK",
    "STEEL",
    "FAIRY",
  ],
  order: ["NUMERICAL", "A TO Z", "HEAVIEST", "LIGHTEST", "TALLEST", "SMALLEST"],
};
const root = ref<HTMLElement>();
const scaleX = ref(1);
const scaleY = ref(1);
const entries = ref<PokedexPlaceholderEntry[]>(pokedexPlaceholders.map((entry) => ({ ...entry })));
const namesLoaded = ref(false);
const loadingAllDetails = ref(false);
const loadedDetailIds = new Set<number>();
const loadingDetailIds = new Set<number>();
let resizeObserver: ResizeObserver | undefined;

interface VisibleListRow {
  entry: PokedexPlaceholderEntry | null;
  index: number;
}

const selectedEntry = computed(() => {
  return filteredEntries.value[props.selectedIndex] ?? filteredEntries.value[0] ?? entries.value[0] ?? pokedexPlaceholders[0]!;
});

const detailCategory = computed(() => selectedEntry.value.category.toUpperCase());

const detailName = computed(() => selectedEntry.value.name.toUpperCase());

const activeSearchOptions = computed(() => {
  if (props.searchMode === "fields") {
    return [];
  }

  return searchOptions[props.searchMode];
});

const filteredEntries = computed(() => {
  let result = [...entries.value];
  const { nameGroup, color, type1, type2, order } = props.searchFilters;

  if (nameGroup !== "DON'T SPECIFY") {
    result = result.filter((entry) => nameGroup.includes(entry.name.charAt(0).toUpperCase()));
  }

  if (color !== "DON'T SPECIFY") {
    result = result.filter((entry) => entry.color === color);
  }

  const selectedTypes = [type1, type2].filter((type) => type !== "DON'T SPECIFY");

  if (selectedTypes.length > 0) {
    result = result.filter((entry) => selectedTypes.every((type) => entry.types?.includes(type)));
  }

  switch (order) {
    case "A TO Z":
      result.sort((left, right) => left.name.localeCompare(right.name));
      break;
    case "HEAVIEST":
      result.sort((left, right) => (right.weightValue ?? -1) - (left.weightValue ?? -1));
      break;
    case "LIGHTEST":
      result.sort((left, right) => (left.weightValue ?? Number.MAX_SAFE_INTEGER) - (right.weightValue ?? Number.MAX_SAFE_INTEGER));
      break;
    case "TALLEST":
      result.sort((left, right) => (right.heightValue ?? -1) - (left.heightValue ?? -1));
      break;
    case "SMALLEST":
      result.sort((left, right) => (left.heightValue ?? Number.MAX_SAFE_INTEGER) - (right.heightValue ?? Number.MAX_SAFE_INTEGER));
      break;
    default:
      result.sort((left, right) => left.id - right.id);
      break;
  }

  return result;
});

const visibleListRows = computed<VisibleListRow[]>(() => {
  return Array.from({ length: LIST_WINDOW_SIZE }, (_, rowIndex) => {
    const index = props.selectedIndex + rowIndex - LIST_WINDOW_CENTER_INDEX;

    return {
      entry: filteredEntries.value[index] ?? null,
      index,
    };
  });
});

const stageStyle = computed(() => ({
  transform: `scale(${scaleX.value}, ${scaleY.value})`,
}));

onMounted(() => {
  resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) {
      return;
    }

    const { width, height } = entry.contentRect;
    scaleX.value = width / NATIVE_WIDTH;
    scaleY.value = height / NATIVE_HEIGHT;
  });

  if (root.value) {
    resizeObserver.observe(root.value);
  }

  void loadPokedexNames();
  void loadSelectedEntry();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

watch(
  () => props.selectedIndex,
  () => {
    void loadSelectedEntry();
  },
);

watch(
  () => filteredEntries.value.length,
  (count) => {
    emit("filtered-count-change", count);
  },
  { immediate: true },
);

watch(
  () => props.view,
  (view) => {
    if (view !== "search") {
      void loadSelectedEntry();
    }
  },
);

watch(
  () => [
    props.searchFilters.color,
    props.searchFilters.type1,
    props.searchFilters.type2,
    props.searchFilters.order,
  ],
  () => {
    if (searchNeedsAllDetails.value) {
      void loadAllEntryDetails();
    }
  },
);

const searchNeedsAllDetails = computed(() => (
  props.searchFilters.color !== "DON'T SPECIFY" ||
  props.searchFilters.type1 !== "DON'T SPECIFY" ||
  props.searchFilters.type2 !== "DON'T SPECIFY" ||
  ["HEAVIEST", "LIGHTEST", "TALLEST", "SMALLEST"].includes(props.searchFilters.order)
));

function formatDexNumber(id: number): string {
  return `No.${String(id).padStart(3, "0")}`;
}

function formatListDexNumber(id: number): string {
  return `No.${String(id).padStart(2, "0")}`;
}

async function loadPokedexNames(): Promise<void> {
  try {
    const names = await fetchPokedexNames(entries.value.length);

    entries.value = entries.value.map((entry, index) => ({
      ...entry,
      ...names[index],
    }));

    namesLoaded.value = true;
    void loadSelectedEntry();

    if (searchNeedsAllDetails.value) {
      void loadAllEntryDetails();
    }
  } catch (error) {
    console.warn("Unable to load Hoenn Pokedex names from PokeAPI.", error);
  }
}

async function loadSelectedEntry(): Promise<void> {
  await loadEntryDetails(selectedEntry.value);
}

async function loadAllEntryDetails(): Promise<void> {
  if (!namesLoaded.value || loadingAllDetails.value) {
    return;
  }

  loadingAllDetails.value = true;

  try {
    for (const entry of entries.value) {
      if (!loadedDetailIds.has(entry.id)) {
        await loadEntryDetails(entry);
      }
    }
  } finally {
    loadingAllDetails.value = false;
  }
}

async function loadEntryDetails(entry: PokedexPlaceholderEntry): Promise<void> {
  if (loadedDetailIds.has(entry.id) || loadingDetailIds.has(entry.id)) {
    return;
  }

  loadingDetailIds.add(entry.id);

  try {
    const details = await fetchPokedexEntry(entry);
    const currentIndex = entries.value.findIndex((candidate) => candidate.id === entry.id);

    if (currentIndex >= 0) {
      entries.value = entries.value.map((candidate, index) => (
        index === currentIndex
          ? { ...candidate, ...details }
          : candidate
      ));
      loadedDetailIds.add(entry.id);
    }
  } catch (error) {
    console.warn(`Unable to load Pokedex entry ${entry.id} from PokeAPI.`, error);
  } finally {
    loadingDetailIds.delete(entry.id);
  }
}
</script>

<template>
  <section ref="root" class="pokedex-screen" aria-label="Pokedex">
    <div class="pokedex-stage" :style="stageStyle">
      <template v-if="view === 'list'">
        <img class="pokedex-bg" :src="dashboard" alt="">

        <div class="pokedex-list">
          <div v-for="(row, rowIndex) in visibleListRows" :key="row.entry?.id ?? `empty-${row.index}`"
            class="pokedex-row" :class="{ 'pokedex-row--selected': rowIndex === LIST_WINDOW_CENTER_INDEX }">
            <span class="pokedex-row__cursor">▶</span>
            <template v-if="row.entry">
              <span class="pokedex-row__number">{{ formatListDexNumber(row.entry.id) }}</span>
              <span>{{ row.entry.name }}</span>
            </template>
          </div>
        </div>

        <img v-if="selectedIndex > 0" class="pokedex-arrow pokedex-arrow--up" :src="arrowUp" alt="">
        <img v-if="selectedIndex < filteredEntries.length - 1" class="pokedex-arrow pokedex-arrow--down" :src="arrowDown"
          alt="">

        <div class="pokedex-preview">
          <img v-if="selectedEntry.sprite" class="pokedex-preview__sprite-image" :src="selectedEntry.sprite" alt="">
          <div v-else class="pokedex-preview__sprite"></div>
        </div>
      </template>

      <template v-else-if="view === 'detail'">
        <img class="pokedex-detail-topbar" :src="detailTopbar" alt="">
        <img class="pokedex-detail-bg" :src="detailBackground" alt="">

        <div class="pokedex-detail-info">
          <div class="pokedex-detail-info__name">
            {{ formatDexNumber(selectedEntry.id) }} {{ detailName }}
          </div>
          <div class="pokedex-detail-info__category">
            {{ detailCategory }} POKéMON
          </div>
          <div class="pokedex-detail-info__metric pokedex-detail-info__metric--height">
            <span>HT</span>
            <span>{{ selectedEntry.height }}</span>
          </div>
          <div class="pokedex-detail-info__metric pokedex-detail-info__metric--weight">
            <span>WT</span>
            <span>{{ selectedEntry.weight }}</span>
          </div>
        </div>
        <img v-if="selectedEntry.sprite" class="pokedex-detail-sprite-image" :src="selectedEntry.sprite" alt="">
        <div v-else class="pokedex-detail-sprite"></div>
        <p class="pokedex-detail-description">
          {{ selectedEntry.description }}
        </p>
      </template>

      <template v-else>
        <img class="pokedex-search-bg" :src="searchBackground" alt="">

        <div class="pokedex-search-list">
          <div
            v-for="(row, index) in searchRows"
            :key="row.label"
            class="pokedex-search-row"
            :class="{
              'pokedex-search-row--selected': searchMode === 'fields' && index === searchIndex,
              'pokedex-search-row--type': row.field === 'type',
            }"
          >
            <span class="pokedex-search-row__cursor">▶</span>
            <template v-if="row.field === 'nameGroup'">
              <span class="pokedex-search-row__value">{{ searchFilters.nameGroup }}</span>
            </template>
            <template v-else-if="row.field === 'color'">
              <span class="pokedex-search-row__value">{{ searchFilters.color }}</span>
            </template>
            <template v-else-if="row.field === 'type'">
              <span
                class="pokedex-search-row__value pokedex-search-row__value--type pokedex-search-row__value--type-left"
                :class="{ 'pokedex-search-row__value--active': searchTypeSlot === 1 }"
              >
                {{ searchFilters.type1 }}
              </span>
              <span
                class="pokedex-search-row__value pokedex-search-row__value--type pokedex-search-row__value--type-right"
                :class="{ 'pokedex-search-row__value--active': searchTypeSlot === 2 }"
              >
                {{ searchFilters.type2 }}
              </span>
            </template>
            <template v-else-if="row.field === 'order'">
              <span class="pokedex-search-row__value">{{ searchFilters.order }}</span>
            </template>
          </div>
        </div>

        <div v-if="searchMode !== 'fields'" class="pokedex-search-options">
          <div
            v-for="(option, index) in activeSearchOptions"
            :key="option"
            class="pokedex-search-option"
            :class="{ 'pokedex-search-option--selected': index === searchOptionIndex }"
          >
            <span class="pokedex-search-option__cursor">▶</span>
            <span>{{ option }}</span>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.pokedex-screen {
  position: absolute;
  inset: 0;
  z-index: 13;
  overflow: hidden;
  color: #383838;
  font-family: var(--game-font);
  font-size: var(--game-pokedex-font-size);
  font-synthesis: none;
  font-weight: 400;
  letter-spacing: var(--game-letter-spacing);
  line-height: 1;
  text-shadow: none;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
}

.pokedex-stage {
  position: absolute;
  left: 0;
  top: 0;
  width: 240px;
  height: 160px;
  overflow: hidden;
  transform-origin: top left;
}

.pokedex-bg,
.pokedex-detail-bg,
.pokedex-search-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 240px;
  height: 160px;
  image-rendering: pixelated;
}

.pokedex-detail-bg {
  top: 18px;
  height: 143px;
}

.pokedex-detail-topbar {
  position: absolute;
  left: 0;
  top: 0;
  width: 240px;
  height: 18px;
  image-rendering: pixelated;
}

.pokedex-list {
  position: absolute;
  left: 142px;
  top: 21px;
  width: 90px;
  height: 118px;
  display: grid;
  row-gap: 3px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom,
      transparent 0,
      black 12px,
      black calc(100% - 12px),
      transparent 100%);
  mask-image: linear-gradient(to bottom,
      transparent 0,
      black 12px,
      black calc(100% - 12px),
      transparent 100%);
}

.pokedex-row {
  display: grid;
  grid-template-columns: 7px 24px 1fr;
  align-items: center;
  height: 8px;
  white-space: nowrap;
}

.pokedex-row__cursor {
  visibility: hidden;
  font-size: 6px;
  transform: translateY(-1px);
}

.pokedex-row--selected {
  color: #101010;
}

.pokedex-row--selected .pokedex-row__cursor {
  visibility: visible;
}

.pokedex-row__number {
  font-size: 6px;
}

.pokedex-arrow {
  position: absolute;
  left: 178px;
  width: 14px;
  height: 8px;
  image-rendering: pixelated;
  animation-duration: 900ms;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.pokedex-arrow--up {
  top: 2px;
  animation-name: pokedex-arrow-up-bob;
}

.pokedex-arrow--down {
  top: 150px;
  animation-name: pokedex-arrow-down-bob;
}

@keyframes pokedex-arrow-up-bob {

  0%,
  100% {
    transform: translateY(0);
  }

  45% {
    transform: translateY(-2px);
  }

  70% {
    transform: translateY(1px);
  }
}

@keyframes pokedex-arrow-down-bob {

  0%,
  100% {
    transform: translateY(0);
  }

  45% {
    transform: translateY(2px);
  }

  70% {
    transform: translateY(-1px);
  }
}

.pokedex-preview {
  position: absolute;
  left: 73px;
  top: 37px;
  width: 54px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pokedex-preview__sprite,
.pokedex-detail-sprite {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(48, 48, 48, 0.35);
  background:
    linear-gradient(135deg, transparent 46%, rgba(48, 48, 48, 0.25) 48%, rgba(48, 48, 48, 0.25) 52%, transparent 54%),
    linear-gradient(45deg, transparent 46%, rgba(48, 48, 48, 0.25) 48%, rgba(48, 48, 48, 0.25) 52%, transparent 54%),
    rgba(255, 255, 255, 0.45);
}

.pokedex-preview__sprite-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  image-rendering: pixelated;
  transform: translateY(20px);
}

.pokedex-detail-info {
  position: absolute;
  left: 82px;
  top: 31px;
  width: 136px;
  height: 58px;
}

.pokedex-detail-info__name {
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
}

.pokedex-detail-info__category {
  position: absolute;
  right: 0;
  top: 13px;
  text-align: right;
  white-space: nowrap;
}

.pokedex-detail-info__metric {
  position: absolute;
  left: 14px;
  display: grid;
  grid-template-columns: 21px 1fr;
  column-gap: 12px;
  white-space: nowrap;
}

.pokedex-detail-info__metric--height {
  top: 34px;
}

.pokedex-detail-info__metric--weight {
  top: 46px;
}

.pokedex-detail-sprite {
  position: absolute;
  left: 31px;
  top: 25px;
  width: 46px;
  height: 46px;
}

.pokedex-detail-sprite-image {
  position: absolute;
  left: 22px;
  top: 24px;
  width: 64px;
  height: 64px;
  object-fit: contain;
  image-rendering: pixelated;
}

.pokedex-detail-description {
  position: absolute;
  left: 10px;
  top: 96px;
  width: 218px;
  margin: 0;
  line-height: 1.45;
}

.pokedex-search-list {
  position: absolute;
  left: 2px;
  top: 16px;
  width: 137px;
}

.pokedex-search-row {
  display: grid;
  grid-template-columns: 8px 34px 1fr;
  align-items: center;
  height: 15px;
  white-space: nowrap;
}

.pokedex-search-row--type {
  grid-template-columns: 8px 34px 45px 45px;
}

.pokedex-search-row__cursor {
  visibility: hidden;
  font-size: 6px;
  transform: translateY(-1px);
}

.pokedex-search-row--selected {
  color: #101010;
}

.pokedex-search-row--selected .pokedex-search-row__cursor {
  visibility: visible;
}

.pokedex-search-row__value {
  grid-column: 3;
  overflow: hidden;
  text-overflow: clip;
}

.pokedex-search-row__value--type {
  font-size: 6px;
}

.pokedex-search-row__value--type-left {
  grid-column: 3;
}

.pokedex-search-row__value--type-right {
  grid-column: 4;
}

.pokedex-search-row__value--active {
  color: #101010;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.pokedex-search-options {
  position: absolute;
  left: 139px;
  top: 17px;
  width: 94px;
  max-height: 86px;
  overflow: hidden;
}

.pokedex-search-option {
  display: grid;
  grid-template-columns: 7px 1fr;
  align-items: center;
  height: 8px;
  margin-bottom: 3px;
  white-space: nowrap;
}

.pokedex-search-option__cursor {
  visibility: hidden;
  font-size: 6px;
  transform: translateY(-1px);
}

.pokedex-search-option--selected .pokedex-search-option__cursor {
  visibility: visible;
}
</style>
