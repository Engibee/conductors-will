<template>
  <div class="world-map-inner" v-html="worldMapUrl" @click="handleClick"></div>
</template>

<style scoped>
.world-map-inner {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.world-map {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  pointer-events: none;
}
</style>

<script setup>
import worldMap from '../assets/world-map.svg?raw';
import { selectedContinent } from '../composables/gameState.js';

const worldMapUrl = worldMap;

const handleClick = (event) => {
  let clickedElement = event.target;

  if (clickedElement.tagName === 'path') {
    // Checamos se o elemento pai tem um ID (ou seja, é um grupo de continente)
    const group = clickedElement.closest('g[id]');

    if (group) {
      // Define o continente selecionado
      console.log("Continent:", group.id);
      selectedContinent.name = group.id;

      // Resetando cor de todos os grupos (opcional)
      document.querySelectorAll('svg g[id]').forEach(g => {
        g.querySelectorAll('path').forEach(p => p.setAttribute('fill', '#080404'));
      });

      // Aplicando a nova cor ao grupo clicado
      group.querySelectorAll('path').forEach(p => p.setAttribute('fill', 'red'));
    }
  }
};

</script>
