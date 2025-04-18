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
    if (clickedElement.id) {
    }
    else if (clickedElement.parentNode?.id) {
      console.log("Continent:", clickedElement.parentNode.id);
      selectedContinent.name = clickedElement.parentNode.id;
    }
  }
};

</script>
