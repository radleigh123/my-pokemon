<script setup lang="ts">
defineProps<{
  speaker: string
  text: string
}>()
</script>

<template>
  <div class="dialogue">
    <div class="speaker">
      {{ speaker }}
    </div>

    <div class="text">
      {{ text }}
    </div>

    <div class="arrow">
      ▼
    </div>
  </div>
</template>

<style scoped>
.dialogue {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 0;

  height: 96px;

  background: white;

  border-top: 3px solid black;

  color: black;

  padding: 8px;

  box-sizing: border-box;

  font-family: var(--game-font);
  font-synthesis: none;
  font-weight: 400;
  letter-spacing: 0;
  text-shadow: none;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;

  z-index: 10;
}

.speaker {
  font-weight: 700;
  margin-bottom: 6px;
}

.arrow {
  position: absolute;
  right: 12px;
  bottom: 8px;
}
</style>
