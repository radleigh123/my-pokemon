import { defineStore } from "pinia";
import { ref } from "vue";

export const useInputStore = defineStore("input", () => {
  const up = ref(false)
  const down = ref(false)
  const left = ref(false)
  const right = ref(false)

  const a = ref(false)
  const b = ref(false)

  const start = ref(false)
  const select = ref(false)

  function keyDown(e: KeyboardEvent) {
    switch (e.code) {
      case "ArrowUp":
        up.value = true
        break

      case "ArrowDown":
        down.value = true
        break

      case "ArrowLeft":
        left.value = true
        break

      case "ArrowRight":
        right.value = true
        break

      case "KeyZ":
        a.value = true
        break

      case "KeyX":
        b.value = true
        break

      case "Enter":
        start.value = true
        break

      case "Backspace":
        select.value = true
        break
    }
  }

  function keyUp(e: KeyboardEvent) {
    switch (e.code) {
      case "ArrowUp":
        up.value = false
        break

      case "ArrowDown":
        down.value = false
        break

      case "ArrowLeft":
        left.value = false
        break

      case "ArrowRight":
        right.value = false
        break

      case "KeyZ":
        a.value = false
        break

      case "KeyX":
        b.value = false
        break

      case "Enter":
        start.value = false
        break

      case "Backspace":
        select.value = false
        break
    }
  }

  return {
    up,
    down,
    left,
    right,
    a,
    b,
    start,
    select,
    keyDown,
    keyUp
  }
})
