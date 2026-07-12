import { defineStore } from "pinia";
import { ref } from "vue";

export type InputButton = "up" | "down" | "left" | "right" | "a" | "b" | "start" | "select";

const keyCodeByButton: Record<InputButton, string> = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  a: "KeyX",
  b: "KeyZ",
  start: "Enter",
  select: "Backspace",
}

export const useInputStore = defineStore("input", () => {
  const up = ref(false)
  const down = ref(false)
  const left = ref(false)
  const right = ref(false)

  const a = ref(false)
  const b = ref(false)

  const start = ref(false)
  const select = ref(false)

  const buttons = {
    up,
    down,
    left,
    right,
    a,
    b,
    start,
    select,
  }

  function setButton(button: InputButton, pressed: boolean) {
    buttons[button].value = pressed
  }

  function dispatchKeyboardInput(button: InputButton, type: "keydown" | "keyup") {
    window.dispatchEvent(new KeyboardEvent(type, {
      bubbles: true,
      cancelable: true,
      code: keyCodeByButton[button],
    }))
  }

  function press(button: InputButton) {
    setButton(button, true)
    dispatchKeyboardInput(button, "keydown")
  }

  function release(button: InputButton) {
    setButton(button, false)
    dispatchKeyboardInput(button, "keyup")
  }

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

      case "KeyX":
        a.value = true
        break

      case "KeyZ":
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

      case "KeyX":
        a.value = false
        break

      case "KeyZ":
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
    press,
    release,
    keyDown,
    keyUp
  }
})
