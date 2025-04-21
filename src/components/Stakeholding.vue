<template>
  <div class="main-container">
    <div class="chart-wrapper">
      <canvas ref="stakeholdingCanvas"></canvas>
    </div>
    <div class="button-row">
      <button @click="pause" class="button">Botão 1</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { gameState } from "../composables/gameState";

function pause(){
  gameState.isPaused ? gameState.isPaused = false : gameState.isPaused = true;
  gameState.isStakeModalOpen = true;
  console.log(gameState.isPaused);
  console.log(gameState.isStakeModalOpen);
}

Chart.register(zoomPlugin);

const props = defineProps({
  labels: Array,
  data: Array,
});

const stakeholdingCanvas = ref(null);
let chartInstance = null;

onMounted(() => {
  chartInstance = new Chart(stakeholdingCanvas.value, {
    type: "pie",
    data: {
      labels: ["Brasil", "Chile", "Congo", "Austrália"],
      datasets: [
        {
          label: "Participação no Stake",
          data: [25, 35, 20, 20], // em porcentagem
          backgroundColor: [
            "#4CAF50", // Verde
            "#FF9800", // Laranja
            "#2196F3", // Azul
            "#9C27B0", // Roxo
          ],
          borderColor: "#fff",
          borderWidth: 0,
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      },
    },
  });
});

watch(
  () => [props.labels, props.data],
  () => {
    if (chartInstance) {
      chartInstance.data.labels = [...props.labels];
      chartInstance.data.datasets[0].data = [...props.data];
      chartInstance.update();
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.chart-wrapper {
  width: 114px; /* ou qualquer valor menor */
  height: 120px;
  left: 0px;
  margin: auto; /* centraliza */
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

.main-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.button {
  padding: 0px;
  border-radius: 0px;
}
</style>
