<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

import { Game } from "@/engine/core/Game";
import DialogueBox from "./DialogueBox.vue";

const canvas = ref<HTMLCanvasElement>();

let game: Game;

const speaker = ref("");
const text = ref("");
const visible = ref(false);

let uiLoop = 0;

function updateUI() {
  const dialogue = game.getDialogue();

  visible.value = dialogue.isActive();
  speaker.value = dialogue.getSpeaker();
  text.value = dialogue.getCurrentLine();

  uiLoop = requestAnimationFrame(updateUI);
}

onMounted(async () => {
  if (!canvas.value) {
    return;
  }

  game = new Game(canvas.value);

  await game.start();

  updateUI();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(uiLoop);
  game.stop();
});
</script>

<template>
  <DialogueBox
  v-if="visible"
  :speaker="speaker"
  :text="text"
   />
  <canvas ref="canvas"></canvas>
</template>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  display: block;

  image-rendering: pixelated;
}
</style>
