<!-- components/TickHandler.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/gameStore.js'

let interval = null
const game = useGameStore()
let lastTime = 0

onMounted(() => {
  console.log('✅ Tick handler montado')
  
  const handleTick = (timestamp) => {
    if (!game.isPaused) {
      const deltaTime = timestamp - lastTime;
      if (deltaTime >= 1000) {
        game.ticks++;
        lastTime = timestamp;
      }
    }
    interval = requestAnimationFrame(handleTick);
  }
  
  interval = requestAnimationFrame(handleTick);
})

onUnmounted(() => {
  console.log('🛑 Tick handler destruído')
  cancelAnimationFrame(interval)
})
</script>

<template>
  <div style="display: none"></div>
</template>
