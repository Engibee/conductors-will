<script setup>
import { onMounted, onUnmounted } from "vue";
import { useGameStore } from "../stores/gameStore.js";

let interval = null;
const game = useGameStore();
let lastTick = Date.now();

onMounted(() => {
  console.log("✅ Tick handler montado");

  interval = setInterval(() => {
    if (game.isPaused) return;

    const now = Date.now();
    const delta = now - lastTick;

    if (delta >= 1000) {
      const ticksToRun = Math.floor(delta / 1000);
      game.ticks += ticksToRun;
      lastTick += ticksToRun * 1000;
    }
  }, 250);
});

onUnmounted(() => {
  console.log("🛑 Tick handler destruído");
  clearInterval(interval);
});
</script>

<template>
  <div style="display: none"></div>
</template>
