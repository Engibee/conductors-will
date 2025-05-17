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
import { useGameStore } from "../stores/gameStore";
import { useStakeHoldingTradingStore } from "../stores/stakeTrading";

const stakeHoldingTradingStore = useStakeHoldingTradingStore();
const game = useGameStore();

function pause() {
  if (stakeHoldingTradingStore.selectedOrganization !== "Nothing selected") {
    game.isPaused
      ? (game.isPaused = false)
      : (game.isPaused = true);
    game.isStakeModalOpen = true;
  }
  else {
    alert("Please select an organization to trade with.");
  }
}

const stakeData = computed(() => [
  stakeHoldingTradingStore.Governments.stake,
  stakeHoldingTradingStore.TechCorporations.stake,
  stakeHoldingTradingStore.FinancialFunds.stake,
  stakeHoldingTradingStore.NGOs.stake,
  stakeHoldingTradingStore.You,
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
    stakeHoldingTradingStore.selectedOrganization = label;
    console.log("Selected:", stakeHoldingTradingStore.selectedOrganization);
  }
}
</script>

<style scoped>
.chart-wrapper {
  width: 8.90vw;
  height: 20.44vh;
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
  padding: 1.36vh 0.625vw;
  margin-right: 0.39vw;
  cursor: pointer;
}

.button-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
