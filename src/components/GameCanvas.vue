<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

import { Game } from "@/engine/core/Game";
import DialogueBox from "./DialogueBox.vue";
import PokedexScreen from "./PokedexScreen.vue";
import StartMenu from "./StartMenu.vue";
import { pokedexPlaceholders } from "@/data/pokedexPlaceholders";

const canvas = ref<HTMLCanvasElement>();

let game: Game;

const speaker = ref("");
const text = ref("");
const visible = ref(false);
const activeOverlay = ref<"none" | "startMenu" | "pokedex">("none");
const menuIndex = ref(0);
const pokedexIndex = ref(0);
const pokedexView = ref<"list" | "detail" | "search">("list");
const pokedexSearchIndex = ref(0);
const POKEDEX_SEARCH_ROW_COUNT = 5;

let uiLoop = 0;

function updateUI() {
  const dialogue = game.getDialogue();

  visible.value = dialogue.isActive();
  speaker.value = dialogue.getSpeaker();
  text.value = dialogue.getCurrentLine();
  game.setPaused(activeOverlay.value !== "none");

  uiLoop = requestAnimationFrame(updateUI);
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.repeat) {
    return;
  }

  if (event.code === "Enter") {
    if (activeOverlay.value === "pokedex") {
      event.preventDefault();
      return;
    }

    if (visible.value && activeOverlay.value === "none") {
      return;
    }

    activeOverlay.value = activeOverlay.value === "startMenu" ? "none" : "startMenu";
    event.preventDefault();
    return;
  }

  if (activeOverlay.value === "none") {
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
      if (menuIndex.value === 1) {
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
        pokedexSearchIndex.value = Math.max(0, pokedexSearchIndex.value - 1);
      } else {
        pokedexIndex.value = Math.max(0, pokedexIndex.value - 1);
      }

      event.preventDefault();
      break;

    case "ArrowDown":
      if (pokedexView.value === "search") {
        pokedexSearchIndex.value = Math.min(POKEDEX_SEARCH_ROW_COUNT - 1, pokedexSearchIndex.value + 1);
      } else {
        pokedexIndex.value = Math.min(pokedexPlaceholders.length - 1, pokedexIndex.value + 1);
      }

      event.preventDefault();
      break;

    case "KeyX":
      if (pokedexView.value === "list") {
        pokedexView.value = "detail";
      }

      event.preventDefault();
      break;

    case "KeyZ":
      if (pokedexView.value === "detail" || pokedexView.value === "search") {
        pokedexView.value = "list";
      } else {
        activeOverlay.value = "startMenu";
      }

      event.preventDefault();
      break;

    case "Backspace":
      if (pokedexView.value === "list") {
        pokedexSearchIndex.value = 0;
        pokedexView.value = "search";
      } else {
        pokedexView.value = "list";
      }

      event.preventDefault();
      break;
  }
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
    />
    <StartMenu
      v-if="activeOverlay === 'startMenu'"
      :selected-index="menuIndex"
    />
    <PokedexScreen
      v-if="activeOverlay === 'pokedex'"
      :selected-index="pokedexIndex"
      :search-index="pokedexSearchIndex"
      :view="pokedexView"
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
