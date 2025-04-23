<template>
  <div class="main-container">
    <div class="chart-wrapper">
      <canvas ref="stakeholdingCanvas" @click="onChartClick"></canvas>
    </div>
    <div class="button-row">
      <button @click="pause" class="button">Trade Deal</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from "vue";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { gameState, stakeHoldingTrading } from "../composables/gameState";

function pause() {
  if (stakeHoldingTrading.selectedOrganization !== "Nothing selected") {
    gameState.isPaused
      ? (gameState.isPaused = false)
      : (gameState.isPaused = true);
    gameState.isStakeModalOpen = true;
  }
  else {
    alert("Please select an organization to trade with.");
  }
}

const stakeData = computed(() => [
  stakeHoldingTrading.Governments.stake,
  stakeHoldingTrading.TechCorporations.stake,
  stakeHoldingTrading.FinancialFunds.stake,
  stakeHoldingTrading.NGOs.stake,
  stakeHoldingTrading.You,
]);

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
      labels: [
        "Governments",
        "Tech Corporations",
        "Financial Funds",
        "NGOs",
        "You",
      ],
      datasets: [
        {
          label: "Stakes",
          data: [
            ...stakeData.value
          ], // em porcentagem
          backgroundColor: [
            "#4CAF50", // Verde
            "#FF9800", // Laranja
            "#2196F3", // Azul
            "#9C27B0", // Roxo
            "#FF5722", // Vermelho
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
  stakeData,
  (newData) => {
    if (chartInstance) {
      chartInstance.data.datasets[0].data = [...newData];
      chartInstance.update();
    }
  }
);

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

function onChartClick(event) {
  const points = chartInstance.getElementsAtEventForMode(
    event,
    "nearest",
    { intersect: true },
    true
  );

  if (points.length > 0) {
    const index = points[0].index;
    const label = chartInstance.data.labels[index];
    stakeHoldingTrading.selectedOrganization = label;
    console.log("Selected:", stakeHoldingTrading.selectedOrganization);
  }
}
</script>

<style scoped>
.chart-wrapper {
  width: 114px;
  height: 120px;
  left: 0px;
  margin: auto;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
  margin-right: 5px;
  cursor: pointer;
}

.button-row {
  display: flex;
  flex-direction: column;
  justify-content: center; /* <-- alinha verticalmente */
  align-items: center; /* <-- centraliza na horizontal */ /* ou a altura que você quiser */
}
</style>
