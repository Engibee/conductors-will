<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup>

import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

const props = defineProps({
  labels: Array,
  data: Array
});

const chartCanvas = ref(null);
let chartInstance = null;

onMounted(() => {
  chartInstance = new Chart(chartCanvas.value, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Monthly sales",
            data: [],
            borderColor: "white",
            backgroundColor: "lightblue",
            tension: 0.4,
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
            display: true,
            ticks: { color: "white" },
          },
          y: {
            display: true,
            ticks: { color: "white", beginAtZero: true },
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
canvas {
  width: 100%;
  height: 100%;
}
</style>