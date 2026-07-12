<script setup lang="ts">
defineProps<{
  selectedIndex: number
}>()

const items = ["PLAYER", "POKEDEX"]
</script>

<template>
  <nav class="start-menu" aria-label="Start menu">
    <div
      v-for="(item, index) in items"
      :key="item"
      class="start-menu__item"
      :class="{ 'start-menu__item--selected': index === selectedIndex }"
    >
      <span class="start-menu__cursor">▶</span>
      <span>{{ item }}</span>
    </div>
  </nav>
</template>

<style scoped>
.start-menu {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 12;

  min-width: 88px;
  padding: 7px 8px 7px 7px;

  color: #202020;
  background: #f8f8f8;
  border: 2px solid #303030;
  box-shadow:
    inset 0 0 0 2px #78a8d8,
    inset 0 0 0 4px #d8f0f8;

  font-family: var(--game-font);
  font-size: var(--game-menu-font-size);
  font-synthesis: none;
  font-weight: 400;
  letter-spacing: var(--game-letter-spacing);
  line-height: 1;
  text-shadow: none;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
}

.start-menu__item {
  display: grid;
  grid-template-columns: 12px 1fr;
  align-items: center;
  min-height: 18px;
  white-space: nowrap;
}

.start-menu__cursor {
  visibility: hidden;
  font-size: 9px;
  transform: translateY(-1px);
}

.start-menu__item--selected .start-menu__cursor {
  visibility: visible;
}
</style>
