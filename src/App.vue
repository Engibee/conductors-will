<script setup>
import { usePaperclipGame } from './composables/usePaperclipGame.js'
const { paperclips, fioDisponivel, FabricarPaperclip } = usePaperclipGame()
</script>

<template>
  <div>
    <button @click="FabricarPaperclip">Make paperclip</button>
    <h3>Paperclip amount: {{ paperclips }}</h3>
    <h3>Fio disponível: {{ fioDisponivel }}m</h3>
  </div>
</template>

<script>
</script>

<style scoped>
</style>
