<!-- components/TickHandler.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { gameState } from '../composables/gameState.js'

let interval = null

onMounted(() => {
  console.log('✅ Tick handler montado')
  // Use requestAnimationFrame and check visibility
  const handleTick = () => {
    if (!document.hidden && !gameState.isPaused) {
      gameState.ticks++;
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
