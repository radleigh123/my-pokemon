<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import cardBackground from "@/assets/UI/playerCard/card.png";
import playerProfile from "@/assets/player/p-profile.png";

const NATIVE_WIDTH = 240;
const NATIVE_HEIGHT = 160;
const root = ref<HTMLElement>();
const scaleX = ref(1);
const scaleY = ref(1);
let resizeObserver: ResizeObserver | undefined;

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
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <section ref="root" class="player-card" aria-label="Player card">
    <div class="player-card__stage" :style="stageStyle">
      <img class="player-card__background" :src="cardBackground" alt="">
      <img class="player-card__profile" :src="playerProfile" alt="">

      <div class="player-card__id">
        11023
      </div>
      <div class="player-card__name">
        BOB
      </div>
      <div class="player-card__money">
        ₽3300
      </div>
      <div class="player-card__pokedex">
        1
      </div>
      <div class="player-card__play-time">
        9:39
      </div>
    </div>
  </section>
</template>

<style scoped>
.player-card {
  position: absolute;
  inset: 0;
  z-index: 13;
  overflow: hidden;
  color: #202020;
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

.player-card__stage {
  position: absolute;
  left: 0;
  top: 0;
  width: 240px;
  height: 160px;
  overflow: hidden;
  transform-origin: top left;
}

.player-card__background {
  position: absolute;
  left: 0;
  top: 0;
  width: 240px;
  height: 160px;
  image-rendering: pixelated;
}

.player-card__profile {
  position: absolute;
  left: 151px;
  top: 47px;
  width: 65px;
  height: 65px;
  image-rendering: pixelated;
}

.player-card__id,
.player-card__name,
.player-card__money,
.player-card__pokedex,
.player-card__play-time {
  position: absolute;
  white-space: nowrap;
}

.player-card__id {
  left: 162px;
  top: 24px;
}

.player-card__name {
  left: 92px;
  top: 49px;
}

.player-card__money {
  left: 92px;
  top: 72px;
}

.player-card__pokedex {
  left: 92px;
  top: 88px;
}

.player-card__play-time {
  left: 92px;
  top: 103px;
}
</style>
