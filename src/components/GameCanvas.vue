<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

import { Game } from "@/engine/core/Game";
import DialogueBox from "./DialogueBox.vue";
import StartMenu from "./StartMenu.vue";

const canvas = ref<HTMLCanvasElement>();

let game: Game;

const speaker = ref("");
const text = ref("");
const visible = ref(false);
const menuOpen = ref(false);
const menuIndex = ref(0);

let uiLoop = 0;

function updateUI() {
  const dialogue = game.getDialogue();

  visible.value = dialogue.isActive();
  speaker.value = dialogue.getSpeaker();
  text.value = dialogue.getCurrentLine();
  game.setPaused(menuOpen.value);

  uiLoop = requestAnimationFrame(updateUI);
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.repeat) {
    return;
  }

  if (event.code === "Enter") {
    if (visible.value && !menuOpen.value) {
      return;
    }

    menuOpen.value = !menuOpen.value;
    event.preventDefault();
    return;
  }

  if (!menuOpen.value) {
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
      menuOpen.value = false;
      event.preventDefault();
      break;

    case "KeyX":
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
      v-if="menuOpen"
      :selected-index="menuIndex"
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
