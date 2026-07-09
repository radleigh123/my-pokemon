<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

onMounted(() => {
  window.addEventListener("click", unmute, { once: true })
  window.addEventListener("keydown", unmute, { once: true })
  window.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener("click", unmute)
  window.removeEventListener("keydown", unmute)
  window.removeEventListener("keydown", onKeydown)
})

const emit = defineEmits<{
  start: []
}>()

const showUnmutePrompt = ref(true)

const video = ref<HTMLVideoElement>()

function onKeydown(e: KeyboardEvent) {
  if (e.code === "Enter") {
    emit("start")
  }
}

function unmute() {
  if (!video.value) return

  video.value.muted = false
  video.value.volume = 1
  showUnmutePrompt.value = false
}
</script>

<template>
  <div class="intro-container">
    <video class="intro-video" ref="video" loop autoplay muted>
      <source src="@/assets/intro.mp4" type="video/mp4">
    </video>

    <div v-if="showUnmutePrompt" class="unmute-prompt">
      🔊 Click anywhere or press any key to unmute
    </div>
  </div>
</template>

<style scoped>
.intro-video {
  width: 100%;
  height: 100%;
    object-fit: cover;
      object-position: center center;
      display: block;
}

.intro-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.unmute-prompt {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);

  padding: 6px 12px;

  color: white;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 999px;

  font-size: 14px;
  font-weight: bold;

  pointer-events: none;
  user-select: none;

  animation: pulse 1.2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.7;
  }

  50% {
    opacity: 1;
  }
}
</style>
