<script setup lang="ts">
import normal from "@/assets/gba/gba-0.png"
import aPressed from "@/assets/gba/gba-a.png"
import bPressed from "@/assets/gba/gba-b.png"
import upPressed from "@/assets/gba/gba-up.png"
import downPressed from "@/assets/gba/gba-down.png"
import leftPressed from "@/assets/gba/gba-left.png"
import rightPressed from "@/assets/gba/gba-right.png"
import { useInputStore } from "@/stores/input"
import { computed } from "vue"

const input = useInputStore()

const overlay = computed(() => {
  if (input.a) return aPressed
  if (input.b) return bPressed

  if (input.up) return upPressed
  if (input.down) return downPressed
  if (input.left) return leftPressed
  if (input.right) return rightPressed

  return normal
})
</script>

<template>
  <div class="gba">
    <div class="screen">
      <slot />
    </div>

    <img class="overlay" :src="overlay">
  </div>
</template>

<style scoped>
.gba {
  position: relative;
  width: 1300px;
  margin: auto;
}

.overlay {
  position: relative;
  width: 100%;
  display: block;
  z-index: 2;
}

.screen {
  position: absolute;

  left: 247px;
  top: 137px;

  width: 830px;
  height: 425px;

  overflow: hidden;

  z-index: 1;
}
</style>
