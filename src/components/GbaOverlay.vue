<script setup lang="ts">
import normal from "@/assets/gba/gba-0.png"
import aPressed from "@/assets/gba/gba-a.png"
import bPressed from "@/assets/gba/gba-b.png"
import upPressed from "@/assets/gba/gba-up.png"
import downPressed from "@/assets/gba/gba-down.png"
import leftPressed from "@/assets/gba/gba-left.png"
import rightPressed from "@/assets/gba/gba-right.png"
import startPressed from "@/assets/gba/gba-start.png"
import selectPressed from "@/assets/gba/gba-select.png"
import mobileNormal from "@/assets/gba/gba-mobile-0.png"
import mobileAPressed from "@/assets/gba/gba-mobile-a.png"
import mobileBPressed from "@/assets/gba/gba-mobile-b.png"
import mobileUpPressed from "@/assets/gba/gba-mobile-up.png"
import mobileDownPressed from "@/assets/gba/gba-mobile-down.png"
import mobileLeftPressed from "@/assets/gba/gba-mobile-left.png"
import mobileRightPressed from "@/assets/gba/gba-mobile-right.png"
import mobileStartPressed from "@/assets/gba/gba-mobile-start.png"
import mobileSelectPressed from "@/assets/gba/gba-mobile-select.png"
import { type InputButton, useInputStore } from "@/stores/input"
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

const input = useInputStore()
const isMobileLayout = ref(false)
const debugTouchZones = false
const lastTouchDebug = ref("none")
const touchButtons: InputButton[] = ["up", "down", "left", "right", "a", "b", "start", "select"]
const desktopOverlayImages = [
  normal,
  aPressed,
  bPressed,
  upPressed,
  downPressed,
  leftPressed,
  rightPressed,
  startPressed,
  selectPressed,
]
const mobileOverlayImages = [
  mobileNormal,
  mobileAPressed,
  mobileBPressed,
  mobileUpPressed,
  mobileDownPressed,
  mobileLeftPressed,
  mobileRightPressed,
  mobileStartPressed,
  mobileSelectPressed,
]
const preloadedOverlays = new Set<string>()
let mediaQuery: MediaQueryList | undefined
let preloadTimer: number | undefined

function syncMobileLayout(event?: MediaQueryListEvent | MediaQueryList) {
  isMobileLayout.value = event?.matches ?? mediaQuery?.matches ?? false
  scheduleOverlayPreload()
}

onMounted(() => {
  mediaQuery = window.matchMedia("(max-width: 768px), (orientation: portrait)")
  syncMobileLayout(mediaQuery)
  mediaQuery.addEventListener("change", syncMobileLayout)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener("change", syncMobileLayout)

  if (preloadTimer !== undefined) {
    window.clearTimeout(preloadTimer)
  }
})

function getLayoutOverlayImages() {
  return isMobileLayout.value ? mobileOverlayImages : desktopOverlayImages
}

function scheduleOverlayPreload() {
  if (preloadTimer !== undefined) {
    window.clearTimeout(preloadTimer)
  }

  preloadTimer = window.setTimeout(() => {
    preloadTimer = undefined

    for (const src of getLayoutOverlayImages()) {
      if (preloadedOverlays.has(src)) {
        continue
      }

      preloadedOverlays.add(src)

      const image = new Image()
      image.src = src
      void image.decode?.().catch(() => { })
    }
  }, 0)
}

function getPressedOverlay(
  variants: Record<InputButton, string>,
  fallback: string,
) {
  if (input.a) return variants.a
  if (input.b) return variants.b

  if (input.up) return variants.up
  if (input.down) return variants.down
  if (input.left) return variants.left
  if (input.right) return variants.right

  if (input.start) return variants.start
  if (input.select) return variants.select

  return fallback
}

const overlay = computed(() => {
  if (isMobileLayout.value) {
    return getPressedOverlay(
      {
        a: mobileAPressed,
        b: mobileBPressed,
        up: mobileUpPressed,
        down: mobileDownPressed,
        left: mobileLeftPressed,
        right: mobileRightPressed,
        start: mobileStartPressed,
        select: mobileSelectPressed,
      },
      mobileNormal,
    )
  }

  return getPressedOverlay(
    {
      a: aPressed,
      b: bPressed,
      up: upPressed,
      down: downPressed,
      left: leftPressed,
      right: rightPressed,
      start: startPressed,
      select: selectPressed,
    },
    normal,
  )
})

function isButtonPressed(button: InputButton) {
  switch (button) {
    case "up":
      return input.up
    case "down":
      return input.down
    case "left":
      return input.left
    case "right":
      return input.right
    case "a":
      return input.a
    case "b":
      return input.b
    case "start":
      return input.start
    case "select":
      return input.select
  }
}

const activeInputDebug = computed(() => {
  return touchButtons
    .filter(isButtonPressed)
    .join(", ") || "none"
})

function pressButton(button: InputButton, event: PointerEvent) {
  event.preventDefault()
  lastTouchDebug.value = `down: ${button}`
  input.press(button)

  const target = event.currentTarget

  if (target instanceof HTMLElement) {
    try {
      target.setPointerCapture(event.pointerId)
    } catch {
      // Pointer capture is only diagnostic support; input should still work without it.
    }
  }
}

function releaseButton(button: InputButton, event: PointerEvent) {
  event.preventDefault()
  lastTouchDebug.value = `up: ${button}`
  input.release(button)

  const target = event.currentTarget

  if (target instanceof HTMLElement) {
    try {
      target.releasePointerCapture(event.pointerId)
    } catch {
      // The pointer may already be released by the browser.
    }
  }
}
</script>

<template>
  <div class="gba" :class="{ 'gba--mobile': isMobileLayout }">
    <div class="screen">
      <slot />
    </div>

    <img class="overlay" :src="overlay">

    <div v-if="debugTouchZones" class="touch-debug-badge">
      <div>mobile: {{ isMobileLayout }}</div>
      <div>last: {{ lastTouchDebug }}</div>
      <div>active: {{ activeInputDebug }}</div>
    </div>

    <div v-if="isMobileLayout" class="touch-controls" aria-hidden="true">
      <button v-for="button in touchButtons" :key="button" class="touch-zone"
        :class="[`touch-zone--${button}`, { 'touch-zone--debug': debugTouchZones }]" type="button" tabindex="-1"
        @pointerdown="pressButton(button, $event)" @pointerup="releaseButton(button, $event)"
        @pointercancel="releaseButton(button, $event)">
        <span v-if="debugTouchZones" class="touch-zone__label">{{ button.toUpperCase() }}</span>
      </button>
    </div>
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
.touch-controls {
  position: absolute;
  inset: 0;
  z-index: 3;

  touch-action: none;
  user-select: none;
  pointer-events: none;
}

.touch-zone {
  position: absolute;

  appearance: none;
  border: 0;
  padding: 0;
  margin: 0;

  background: transparent;
  pointer-events: auto;
  touch-action: none;
  user-select: none;
}

.touch-zone--debug {
  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 255, 255, 0.24);
  border: 2px solid rgba(0, 255, 255, 0.9);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.55);
}

.touch-zone--debug:active {
  background: rgba(255, 235, 59, 0.38);
  border-color: rgba(255, 235, 59, 0.95);
}

.touch-zone__label {
  color: black;
  background: rgba(255, 255, 255, 0.82);
  padding: 2px 4px;
  border-radius: 2px;
  font: 700 10px/1 monospace;
  pointer-events: none;
}

.touch-debug-badge {
  position: absolute;
  left: 2%;
  top: 2%;
  z-index: 4;

  max-width: 58%;
  padding: 6px 8px;

  color: #00ffbf;
  background: rgba(0, 0, 0, 0.78);
  border: 1px solid rgba(0, 255, 191, 0.85);

  font: 700 11px/1.35 monospace;
  pointer-events: none;
  user-select: none;
}

.touch-zone--up {
  left: 13.5%;
  top: 56.8%;
  width: 9.2%;
  height: 6.2%;
}

.touch-zone--down {
  left: 13.5%;
  top: 71.2%;
  width: 9.2%;
  height: 6.2%;
}

.touch-zone--left {
  left: 4.4%;
  top: 63.2%;
  width: 9.8%;
  height: 8.2%;
}

.touch-zone--right {
  left: 22.6%;
  top: 63.2%;
  width: 9.8%;
  height: 8.2%;
}

.touch-zone--b {
  left: 65%;
  top: 63.6%;
  width: 14%;
  height: 8.5%;
}

.touch-zone--a {
  left: 82.8%;
  top: 59.2%;
  width: 13.8%;
  height: 8.4%;
}

.touch-zone--select {
  left: 28.2%;
  top: 79%;
  width: 15.2%;
  height: 6%;
}

.touch-zone--start {
  left: 46.8%;
  top: 79%;
  width: 15.2%;
  height: 6%;
}
</style>
