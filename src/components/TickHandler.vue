<!-- components/TickHandler.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { gameState } from '../composables/gameState.js'

let interval = null
let lastTime = 0

onMounted(() => {
  console.log('✅ Tick handler montado')
  
  const handleTick = (timestamp) => {
    if (!document.hidden && !gameState.isPaused) {
      // Calculate delta time to handle varying frame rates
      const deltaTime = timestamp - lastTime;
      if (deltaTime >= 1000) { // Ensure 1 second has passed
        gameState.ticks++;
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
