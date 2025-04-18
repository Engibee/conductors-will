<!-- components/TickHandler.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { gameState } from '../composables/gameState.js'

let interval = null

onMounted(() => {
  console.log('✅ Tick handler montado')
  interval = setInterval(() => {
    gameState.ticks++
  }, 1000)
})

onUnmounted(() => {
  console.log('🛑 Tick handler destruído')
  clearInterval(interval)
})
</script>

<template>
  <div style="display: none"></div>
</template>
