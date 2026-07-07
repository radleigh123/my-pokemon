<script setup lang="ts">
import { Game } from "@/engine/core/Game"
import { onBeforeMount, onMounted, ref } from "vue"

const canvas = ref<HTMLCanvasElement>()
let game: Game

onMounted(async () => {
  if (!canvas.value) return

  game = new Game(canvas.value)
  await game.start()
})

onBeforeMount(() => {
  // game.stop()
})
</script>

<template>
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