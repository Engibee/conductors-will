import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";
import { saveGame, loadGame, clearGame } from "./localStorage";
import { formatDate } from "../utils/helpers/format.js";
import Chart from "chart.js/auto";

let chartInstance = null;
let chartLabel = ref([]);
let chartData = ref([]);

 //STOCK HANDLE
 const lifeTimeCopperWire = ref(0);
 const copperWireinMeter = ref(0);
 const availableCopper = ref(10);
 const workers = ref(0);
 export const funds = ref(30);


 //PRICES HANDLE
 const copperQtPerMeter = 0.02232;
 const kgOfCopper = 9.795;
 const priceOfCopper = ref(0.5);
 const workersPrice = ref(35.0);
 const monthlySale = ref(0);
 const marketing = ref(1);
 const marketingPrice = ref(10);

 //TIME HANDLE
 let intervalo = null;
 const ticks = ref(0);
 const week = ref(1);
 const month = ref(1);
 const year = ref(1);

 //LISTS
 const logs = ref([]);

export function chartUpdate(newSale, month) {
  //Global reference update
  chartLabel.value.push(month);
  chartData.value.push(newSale);

  //Instance update
  if (!chartInstance) return;
  chartInstance.data.labels.push(month); // mês
  chartInstance.data.datasets[0].data.push(newSale);
  chartInstance.update();
}

export function chartInstanceUpdateOnly(newSale, month) {
  //Instance update
  if (!chartInstance) return;
  chartInstance.data.labels.push(...month); // mês
  chartInstance.data.datasets[0].data.push(...newSale);
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
          zoom: {
            pan: {
              enabled: true,
              mode: "x", // ou 'y', ou 'xy'
            },
            zoom: {
              wheel: {
                enabled: true, // Habilita zoom com a roda do mouse
              },
              pinch: {
                enabled: true, // Habilita zoom com gesto de pinça (mobile)
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
    clearGame();
    const data = loadGame();
    if (data) {
      ticks.value = data.ticks;
      copperWireinMeter.value = data.copperWireinMeter;
      lifeTimeCopperWire.value = data.lifeTimeCopperWire;
      availableCopper.value = data.availableCopper;
      funds.value = data.funds;
      priceOfCopper.value = data.priceOfCopper;
      workers.value = data.workers;
      workersPrice.value = data.workersPrice;
      marketing.value = data.marketing;
      marketingPrice.value = data.marketinPrice;
      monthlySale.value = data.monthlySale;
      week.value = data.week;
      month.value = data.month;
      year.value = data.year;
      logs.value = data.logs;
      chartInstanceUpdateOnly(data.chartData, data.chartLabel);
    }
  });
  onUnmounted(() => {
    // Limpa o intervalo quando o componente for destruído
    clearInterval(intervalo);
    console.log(`O contador foi limpado/destruído.`);
  });

  const update_tick = () => {
    ticks.value++;
    if (ticks_events(10)) {
      time_handler();
    }
    if (ticks_events(5)) {
      buy_simulation_per_tick();
    }
    if (ticks_events(1)) {
      automation_handler();
      saveGame({
        ticks: ticks.value,
        copperWireinMeter: copperWireinMeter.value,
        lifeTimeCopperWire: lifeTimeCopperWire.value,
        availableCopper: availableCopper.value,
        funds: funds.value,
        priceOfCopper: priceOfCopper.value,
        workers: workers.value,
        workersPrice: workersPrice.value,
        marketing: marketing.value,
        marketinPrice: marketingPrice.value,
        monthlySale: monthlySale.value,
        week: week.value,
        month: month.value,
        year: year.value,
        logs: logs.value,
        chartLabel: chartLabel.value,
        chartData: chartData.value,
      });
    }
  };

  const perks = reactive({
    unlocked: {
      discountPerk: false,
      autoMarketingPerk: false,
    },
    owned: {
      discountPerk: false,
      autoMarketingPerk: false,
    },
  });

  function monthly_sale_graphs_handler() {
    chartUpdate(monthlySale.value, formatDate(month.value, year.value));
    monthlySale.value = 0;
    logMessage("Receita do mês atualizada!");
  }
  function logMessage(message) {
    logs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`);
  }
  function automation_handler() {
    if (availableCopper.value >= copperQtPerMeter * workers.value) {
      copperWireinMeter.value += 1 * workers.value;
      lifeTimeCopperWire.value += 1 * workers.value;
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
  function buy_marketing() {
    if (funds.value >= marketingPrice.value) {
      marketing.value++;
      funds.value -= marketingPrice.value;
      marketingPrice.value = getMarketingPrice(marketing.value);
    }
  }
  function getMarketingPrice(marketingLevel) {
    return Math.floor(10 * Math.pow(marketingLevel, 3));
  }
  function time_handler() {
    if (month.value == 12 && week.value == 4) {
      monthly_sale_graphs_handler();
      year.value++;
      month.value = 1;
      week.value = 1;
    } else if (week.value == 4) {
      monthly_sale_graphs_handler();
      month.value++;
      week.value = 1;
    } else {
      week.value++;
    }
  }
  function ticks_events(tick) {
    return ticks.value % tick === 0;
  }

  function buy_chance(price, marketing = 0) {
    const priceFactor = Math.exp(-((price - 0.5) / 0.2));
  
    // Exponencial suave com base 1.03, dobra em ~24 níveis
    const marketingFactor = Math.pow(1.03, marketing);
    return priceFactor * marketingFactor;
  }

  const currentDemand = computed(() => {
    return buy_chance(priceOfCopper.value, marketing.value);
  });

  function buy_simulation_per_tick() {
    const level = marketing.value;
  
    // Base mínima e máxima ajustadas para dar mais aleatoriedade
    const maxBase = 10 * Math.pow(2, level - 1);
    const minBase = Math.floor(maxBase / 2.5);
  
    const quantity = Math.floor(Math.random() * (maxBase - minBase + 1)) + minBase;
  
    if (quantity > 0 && copperWireinMeter.value >= quantity) {
      copperWireinMeter.value -= quantity;
  
      const revenue = quantity * priceOfCopper.value;
      funds.value += revenue;
      monthlySale.value += revenue;
    }
  }

  function FabricarPaperclip() {
    if (availableCopper.value >= copperQtPerMeter) {
      availableCopper.value -= copperQtPerMeter;
      copperWireinMeter.value++;
      lifeTimeCopperWire.value++;
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
    lifeTimeCopperWire,
    availableCopper,
    funds,
    priceOfCopper,
    workers,
    workersPrice,
    marketing,
    marketingPrice,
    currentDemand,
    week,
    month,
    year,
    logs,
    perks,
    FabricarPaperclip,
    logMessage,
    buy_worker,
    buy_marketing,
    buy_refined_copper,
    increasePrice,
    decreasePrice,
  };
}
