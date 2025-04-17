<template>
  <div class="world-map-inner">
    <object type="image/svg+xml" :data="worldMapUrl" class="world-map" />
  </div>
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
import worldMap from "../assets/world-map.svg";
const worldMapUrl = worldMap;
</script>
