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
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}
</style>

<script setup>
import worldMap from "../assets/world-map.svg?raw";
import { onMounted } from "vue";
import { useContinentRealEstateStore, useSelectedContinentStore } from "../stores/realEstateStore.js";

const worldMapUrl = worldMap;

onMounted(() => {
  document.querySelectorAll('svg g[id]').forEach(g => {
    g.style.cursor = 'pointer';
  });
});

const handleClick = (event) => {
  let clickedElement = event.target;
  const selectedContinentStore = useSelectedContinentStore();

  if (clickedElement.tagName === "path") {
    // Checamos se o elemento pai tem um ID (ou seja, é um grupo de continente)
    const group = clickedElement.closest("g[id]");

    if (group) {
      // Define o continente selecionado
      selectedContinentStore.name = group.id;
      console.log(selectedContinentStore.name);

      // Resetando cor de todos os grupos (opcional)
      document.querySelectorAll("svg g[id]").forEach((g) => {
        g.querySelectorAll("path").forEach((p) =>
          p.setAttribute("fill", "#080404")
        );
      });

      // Aplicando a nova cor ao grupo clicado
      group
        .querySelectorAll("path")
        .forEach((p) => p.setAttribute("fill", "red"));
    }
  }
};
</script>
