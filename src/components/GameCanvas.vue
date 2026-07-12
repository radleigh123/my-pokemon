<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

import { Game } from "@/engine/core/Game";
import DialogueBox from "./DialogueBox.vue";
import PokedexScreen from "./PokedexScreen.vue";
import PlayerCardScreen from "./PlayerCardScreen.vue";
import StartMenu from "./StartMenu.vue";
import { pokedexPlaceholders } from "@/data/pokedexPlaceholders";
import { storyProgress } from "@/story/StoryProgress";

const canvas = ref<HTMLCanvasElement>();

let game: Game;

const speaker = ref("");
const text = ref("");
const visible = ref(false);
const canAdvanceDialogue = ref(false);
const activeOverlay = ref<"none" | "startMenu" | "pokedex" | "playerCard">("none");
const menuIndex = ref(0);
const pokedexIndex = ref(0);
const pokedexView = ref<"list" | "detail" | "search">("list");
const pokedexFilteredCount = ref(pokedexPlaceholders.length);
const pokedexSearchIndex = ref(0);
const pokedexSearchMode = ref<"fields" | "name" | "color" | "type" | "order">("fields");
const pokedexSearchOptionIndex = ref(0);
const pokedexSearchTypeSlot = ref<1 | 2>(1);
const pokedexSearchFilters = ref({
  nameGroup: "DON'T SPECIFY",
  color: "DON'T SPECIFY",
  type1: "DON'T SPECIFY",
  type2: "DON'T SPECIFY",
  order: "NUMERICAL",
});
const POKEDEX_SEARCH_ROW_COUNT = 5;
const SEARCH_OPTION_COUNTS = {
  name: 10,
  color: 11,
  type: 19,
  order: 6,
} as const;

let uiLoop = 0;

function updateUI() {
  const dialogue = game.getDialogue();

  visible.value = dialogue.isActive();
  speaker.value = dialogue.getSpeaker();
  text.value = dialogue.getCurrentLine();
  canAdvanceDialogue.value = dialogue.isCurrentLineComplete();
  game.setPaused(activeOverlay.value !== "none");

  uiLoop = requestAnimationFrame(updateUI);
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.repeat) {
    return;
  }

  if (event.code === "Enter") {
    if (activeOverlay.value !== "none" && activeOverlay.value !== "startMenu") {
      event.preventDefault();
      return;
    }

    if (visible.value && activeOverlay.value === "none") {
      return;
    }

    if (!storyProgress.isMenuUnlocked && activeOverlay.value === "none") {
      event.preventDefault();
      return;
    }

    activeOverlay.value = activeOverlay.value === "startMenu" ? "none" : "startMenu";
    event.preventDefault();
    return;
  }

  if (activeOverlay.value === "none") {
    return;
  }

  if (activeOverlay.value === "playerCard") {
    switch (event.code) {
      case "KeyZ":
      case "Backspace":
        activeOverlay.value = "startMenu";
        event.preventDefault();
        break;
    }

    return;
  }

  if (activeOverlay.value === "pokedex") {
    handlePokedexKeyDown(event);
    return;
  }

  switch (event.code) {
    case "ArrowUp":
    case "ArrowDown":
      menuIndex.value = menuIndex.value === 0 ? 1 : 0;
      event.preventDefault();
      break;

    case "KeyZ":
    case "Backspace":
      activeOverlay.value = "none";
      event.preventDefault();
      break;

    case "KeyX":
      if (menuIndex.value === 0) {
        activeOverlay.value = "playerCard";
      } else if (menuIndex.value === 1) {
        pokedexView.value = "list";
        activeOverlay.value = "pokedex";
      }

      event.preventDefault();
      break;
  }
}

function handlePokedexKeyDown(event: KeyboardEvent): void {
  switch (event.code) {
    case "ArrowUp":
      if (pokedexView.value === "search") {
        if (pokedexSearchMode.value === "fields") {
          pokedexSearchIndex.value = Math.max(0, pokedexSearchIndex.value - 1);
        } else {
          pokedexSearchOptionIndex.value = Math.max(0, pokedexSearchOptionIndex.value - 1);
        }
      } else {
        pokedexIndex.value = Math.max(0, pokedexIndex.value - 1);
      }

      event.preventDefault();
      break;

    case "ArrowDown":
      if (pokedexView.value === "search") {
        if (pokedexSearchMode.value === "fields") {
          pokedexSearchIndex.value = Math.min(POKEDEX_SEARCH_ROW_COUNT - 1, pokedexSearchIndex.value + 1);
        } else {
          pokedexSearchOptionIndex.value = Math.min(getSearchOptionCount() - 1, pokedexSearchOptionIndex.value + 1);
        }
      } else {
        pokedexIndex.value = Math.min(pokedexFilteredCount.value - 1, pokedexIndex.value + 1);
      }

      event.preventDefault();
      break;

    case "ArrowLeft":
      if (pokedexView.value === "search" && pokedexSearchMode.value === "fields" && pokedexSearchIndex.value === 2) {
        pokedexSearchTypeSlot.value = 1;
        event.preventDefault();
      }
      break;

    case "ArrowRight":
      if (pokedexView.value === "search" && pokedexSearchMode.value === "fields" && pokedexSearchIndex.value === 2) {
        pokedexSearchTypeSlot.value = 2;
        event.preventDefault();
      }
      break;

    case "KeyX":
      if (pokedexView.value === "list") {
        pokedexView.value = "detail";
      } else if (pokedexView.value === "search") {
        handlePokedexSearchConfirm();
      }

      event.preventDefault();
      break;

    case "KeyZ":
      if (pokedexView.value === "search" && pokedexSearchMode.value !== "fields") {
        pokedexSearchMode.value = "fields";
      } else if (pokedexView.value === "detail" || pokedexView.value === "search") {
        pokedexView.value = "list";
      } else {
        activeOverlay.value = "startMenu";
      }

      event.preventDefault();
      break;

    case "Backspace":
      if (pokedexView.value === "search" && pokedexSearchMode.value !== "fields") {
        pokedexSearchMode.value = "fields";
      } else if (pokedexView.value === "list") {
        pokedexSearchIndex.value = 0;
        pokedexSearchMode.value = "fields";
        pokedexView.value = "search";
      } else {
        pokedexView.value = "list";
      }

      event.preventDefault();
      break;
  }
}

function getSearchOptionCount(): number {
  if (pokedexSearchMode.value === "fields") {
    return POKEDEX_SEARCH_ROW_COUNT;
  }

  return SEARCH_OPTION_COUNTS[pokedexSearchMode.value];
}

function handlePokedexSearchConfirm(): void {
  if (pokedexSearchMode.value === "fields") {
    const fieldModes = ["name", "color", "type", "order"] as const;
    const nextMode = fieldModes[pokedexSearchIndex.value];

    if (!nextMode) {
      pokedexView.value = "list";
      pokedexIndex.value = 0;
      return;
    }

    pokedexSearchMode.value = nextMode;
    pokedexSearchOptionIndex.value = getCurrentSearchOptionIndex(nextMode);
    return;
  }

  const selectedOption = getCurrentSearchOption();

  switch (pokedexSearchMode.value) {
    case "name":
      pokedexSearchFilters.value.nameGroup = selectedOption;
      break;
    case "color":
      pokedexSearchFilters.value.color = selectedOption;
      break;
    case "type":
      if (pokedexSearchTypeSlot.value === 1) {
        pokedexSearchFilters.value.type1 = selectedOption;
      } else {
        pokedexSearchFilters.value.type2 = selectedOption;
      }
      break;
    case "order":
      pokedexSearchFilters.value.order = selectedOption;
      break;
  }

  pokedexIndex.value = 0;
  pokedexSearchMode.value = "fields";
}

function getCurrentSearchOptionIndex(mode: "name" | "color" | "type" | "order"): number {
  const currentValue = getCurrentSearchValue(mode);
  const optionIndex = getSearchOptions(mode).indexOf(currentValue);

  return Math.max(0, optionIndex);
}

function getCurrentSearchOption(): string {
  return getSearchOptions(pokedexSearchMode.value).at(pokedexSearchOptionIndex.value) ?? "DON'T SPECIFY";
}

function getCurrentSearchValue(mode: "name" | "color" | "type" | "order"): string {
  switch (mode) {
    case "name":
      return pokedexSearchFilters.value.nameGroup;
    case "color":
      return pokedexSearchFilters.value.color;
    case "type":
      return pokedexSearchTypeSlot.value === 1
        ? pokedexSearchFilters.value.type1
        : pokedexSearchFilters.value.type2;
    case "order":
      return pokedexSearchFilters.value.order;
  }
}

function getSearchOptions(mode: "fields" | "name" | "color" | "type" | "order"): string[] {
  switch (mode) {
    case "name":
      return ["DON'T SPECIFY", "ABC", "DEF", "GHI", "JKL", "MNO", "PQR", "STU", "VWX", "YZ"];
    case "color":
      return ["DON'T SPECIFY", "BLACK", "BLUE", "BROWN", "GRAY", "GREEN", "PINK", "PURPLE", "RED", "WHITE", "YELLOW"];
    case "type":
      return [
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
      ];
    case "order":
      return ["NUMERICAL", "A TO Z", "HEAVIEST", "LIGHTEST", "TALLEST", "SMALLEST"];
    case "fields":
      return [];
  }
}

function handlePokedexFilteredCountChange(count: number): void {
  pokedexFilteredCount.value = Math.max(1, count);
  pokedexIndex.value = Math.min(pokedexIndex.value, pokedexFilteredCount.value - 1);
}

onMounted(async () => {
  if (!canvas.value) {
    return;
  }

  window.addEventListener("keydown", onKeyDown);

  game = new Game(canvas.value);

  await game.start();

  updateUI();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
  cancelAnimationFrame(uiLoop);
  game.stop();
});
</script>

<template>
  <div class="game-frame">
    <DialogueBox
      v-if="visible"
      :speaker="speaker"
      :text="text"
      :can-advance="canAdvanceDialogue"
    />
    <StartMenu
      v-if="activeOverlay === 'startMenu'"
      :selected-index="menuIndex"
    />
    <PlayerCardScreen
      v-if="activeOverlay === 'playerCard'"
    />
    <PokedexScreen
      v-if="activeOverlay === 'pokedex'"
      :selected-index="pokedexIndex"
      :search-index="pokedexSearchIndex"
      :search-mode="pokedexSearchMode"
      :search-option-index="pokedexSearchOptionIndex"
      :search-type-slot="pokedexSearchTypeSlot"
      :search-filters="pokedexSearchFilters"
      :view="pokedexView"
      @filtered-count-change="handlePokedexFilteredCountChange"
    />
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.game-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;

  image-rendering: pixelated;
}
</style>
