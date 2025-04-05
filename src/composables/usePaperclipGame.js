import { ref, onMounted, onUnmounted, watch } from "vue";
import Chart from "chart.js/auto";

let chartInstance = null;

export function atualizarGrafico(newSale, month) {
  if (!chartInstance) return;
  chartInstance.data.labels.push(month); // mês
  chartInstance.data.datasets[0].data.push(newSale);
  chartInstance.update();
}

export function salesChart(canvasElement) {
  const graficoCanvas = ref(null); // vai ser usado no <canvas ref="">

  const criarGrafico = () => {
    if (!graficoCanvas.value) {
      console.warn("Canvas não está pronto ainda.");
      return;
    }

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(graficoCanvas.value, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Vendas por mês",
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
            display: false, // remove o "Vendas"
          },
          tooltip: {
            enabled: true, // remove o balãozinho ao passar o mouse
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
  };

  onMounted(() => {
    criarGrafico();
  });

  return {
    graficoCanvas,
    criarGrafico, // caso queira chamar de novo depois (ex: para atualizar)
  };
}
export function usePaperclipGame() {
  onMounted(() => {
    intervalo = setInterval(update_tick, 1000);
    console.log(`O contador foi montado.`);
  });
  onUnmounted(() => {
    // Limpa o intervalo quando o componente for destruído
    clearInterval(intervalo);
    console.log(`O contador foi limpado/destruído.`);
  });
  const ticks = ref(0);
  let intervalo = null;
  const copperWireinMeter = ref(0);
  const availableCopper = ref(10);
  const copperQtPerMeter = 0.02232;
  const funds = ref(30);
  const priceOfCopper = ref(0.5);
  const kgOfCopper = 9.795;
  const workers = ref(0);
  const workersPrice = ref(150.0);
  const monthlySale = ref(0);
  const week = ref(0);
  const month = ref(1);
  const year = ref(0);
  const logs = ref([]);

  const update_tick = () => {
    ticks.value++;
    // Ação a cada 1 tick
    if (ticks_events(5)) {
      buy_simulation_per_tick();
    }
    if (ticks_events(10)) {
      time_handler();
    }
    if (ticks_events(1)) {
      automation_handler();
    }
  };
  function monthly_sale_graphs_handler(){
    atualizarGrafico(monthlySale.value, month.value);
    monthlySale.value = 0;
  }
  function logMessage(message) {
    logs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`);
  }
  function automation_handler() {
    if (availableCopper.value >= copperQtPerMeter * workers.value) {
      copperWireinMeter.value += 1 * workers.value;
      availableCopper.value -= 1 * workers.value * copperQtPerMeter;
    } else {
      //Nothing yet.
    }
  }
  function buy_refined_copper() {
    if (funds.value >= kgOfCopper) {
      availableCopper.value += 1.0;
      funds.value -= kgOfCopper;
    }
  }
  function buy_worker() {
    if (funds.value >= workersPrice.value) {
      funds.value -= workersPrice.value;
      workers.value++;
    }
  }
  function time_handler() {
    if (month.value == 12 && week.value == 4) {
      year.value++;
      month.value = 1;
      week.value = 0;
    } else if (week.value == 4) {
      monthly_sale_graphs_handler();
      month.value++;
      week.value = 0;
    } else {
      week.value++;
    }
  }
  function ticks_events(tick) {
    return ticks.value % tick === 0;
  }

  function buy_chance(price) {
    return 0.8 * Math.exp(-((price - 0.5) / 0.2));
  }

  function buy_simulation_per_tick() {
    const chance = buy_chance(priceOfCopper.value);
    if (Math.random() < chance) {
      const quantity = Math.floor(Math.random() * 10) + 1;
      if (copperWireinMeter.value >= quantity) {
        copperWireinMeter.value -= quantity;
        funds.value += quantity * priceOfCopper.value;
        monthlySale.value += quantity * priceOfCopper.value;
      }
    }
  }

  function FabricarPaperclip() {
    if (availableCopper.value >= copperQtPerMeter) {
      availableCopper.value -= copperQtPerMeter;
      copperWireinMeter.value++;
    }
  }
  function increasePrice() {
    priceOfCopper.value += 0.01;
  }
  function decreasePrice() {
    if (priceOfCopper.value > Number.EPSILON) {
      priceOfCopper.value -= 0.01;
      priceOfCopper.value = Math.max(0, priceOfCopper.value);
    }
  }
  return {
    copperWireinMeter,
    availableCopper,
    funds,
    priceOfCopper,
    workers,
    workersPrice,
    week,
    month,
    year,
    logs,
    FabricarPaperclip,
    logMessage,
    buy_worker,
    buy_refined_copper,
    buy_chance,
    increasePrice,
    decreasePrice,
  };
}
