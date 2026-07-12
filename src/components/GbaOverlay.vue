<script setup lang="ts">
import normal from "@/assets/gba/gba-0.png"
import aPressed from "@/assets/gba/gba-a.png"
import bPressed from "@/assets/gba/gba-b.png"
import upPressed from "@/assets/gba/gba-up.png"
import downPressed from "@/assets/gba/gba-down.png"
import leftPressed from "@/assets/gba/gba-left.png"
import rightPressed from "@/assets/gba/gba-right.png"
import mobileNormal from "@/assets/gba/gba-mobile-0.png"
import { useInputStore } from "@/stores/input"
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

const input = useInputStore()
const isMobileLayout = ref(false)
let mediaQuery: MediaQueryList | undefined

function syncMobileLayout(event?: MediaQueryListEvent | MediaQueryList) {
  isMobileLayout.value = event?.matches ?? mediaQuery?.matches ?? false
}

onMounted(() => {
  mediaQuery = window.matchMedia("(max-width: 768px), (orientation: portrait)")
  syncMobileLayout(mediaQuery)
  mediaQuery.addEventListener("change", syncMobileLayout)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener("change", syncMobileLayout)
})

const overlay = computed(() => {
  if (isMobileLayout.value) return mobileNormal

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
  <div class="gba" :class="{ 'gba--mobile': isMobileLayout }">
    <div class="screen">
      <slot />
    </div>

    <img class="overlay" :src="overlay">
  </div>
</template>

<style scoped>
.gba {
  position: relative;
  width: min(1300px, 100vw);
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

/*   left: 361px;
    top: 138px;

  width: 1361px;
    height: 641px; */
  left: 27.8%;
  top: 18.5%;

  width: 45.3%;
  height: 56.7%;

  overflow: hidden;

  z-index: 1;
}

.gba--mobile {
  width: min(100vw, calc(100dvh * 1973 / 3396));
}

.gba--mobile .screen {
  left: 13.3%;
  top: 10.2%;

  width: 73.5%;
  height: 30.5%;
}
</style>
