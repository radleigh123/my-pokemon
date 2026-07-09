<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import GbaOverlay from './components/GbaOverlay.vue';
import IntroVideo from './components/IntroVideo.vue';
// import HomeScreen from './components/HomeScreen.vue';
import { useInputStore } from './stores/input.ts';
import GameCanvas from './components/GameCanvas.vue';

const input = useInputStore()

onMounted(() => {
  window.addEventListener("keydown", input.keyDown)
  window.addEventListener("keyup", input.keyUp)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", input.keyDown)
  window.removeEventListener("keyup", input.keyUp)
})

const screen = ref<"intro" | "home">("intro")

function goHome() {
  screen.value = "home"
}

</script>

<template>
  <GbaOverlay>
    <IntroVideo v-if="screen === 'intro'" @start="goHome" />

    <GameCanvas v-else />
  </GbaOverlay>
</template>

<style scoped>
</style>
