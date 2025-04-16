import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";
import { saveGame, loadGame, clearGame } from "./localStorage";
import { formatDate } from "../utils/helpers/format.js";
import * as transaction from "../utils/helpers/transactionHandle.js";
import { gameState } from "./gameState.js";
import Chart from "chart.js/auto";

let intervalo = null;

let chartInstance = null;
let chartLabel = ref([]);
let chartData = ref([]);

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
      gameState.ticks.value = data.ticks;
      gameState.copperWireinMeter.value = data.copperWireinMeter;
      gameState.lifeTimeCopperWire.value = data.lifeTimeCopperWire;
      gameState.availableCopper.value = data.availableCopper;
      gameState.funds.value = data.funds;
      gameState.priceOfCopper.value = data.priceOfCopper;
      gameState.workers.value = data.workers;
      gameState.workersPrice.value = data.workersPrice;
      gameState.marketing.value = data.marketing;
      gameState.marketingPrice.value = data.marketinPrice;
      gameState.monthlySale.value = data.monthlySale;
      gameState.week.value = data.week;
      gameState.month.value = data.month;
      gameState.year.value = data.year;
      gameState.logs.value = data.logs;
      chartInstanceUpdateOnly(data.chartData, data.chartLabel);
    }
  });
  onUnmounted(() => {
    // Limpa o intervalo quando o componente for destruído
    clearInterval(intervalo);
    console.log(`O contador foi limpado/destruído.`);
  });

  const update_tick = () => {
    if (ticks_events(10)) {
      time_handler();
    }
    if (ticks_events(5)) {
      buy_simulation_per_tick();
    }
    if (ticks_events(1)) {
      automation_handler();
      saveGame({
        ticks: gameState.ticks.value,
        copperWireinMeter: gameState.copperWireinMeter.value,
        lifeTimeCopperWire: gameState.lifeTimeCopperWire.value,
        availableCopper: gameState.availableCopper.value,
        funds: gameState.funds.value,
        priceOfCopper: gameState.priceOfCopper.value,
        workers: gameState.workers.value,
        workersPrice: gameState.workersPrice.value,
        marketing: gameState.marketing.value,
        marketinPrice: gameState.marketingPrice.value,
        monthlySale: gameState.monthlySale.value,
        week: gameState.week.value,
        month: gameState.month.value,
        year: gameState.year.value,
        logs: gameState.logs.value,
        chartLabel: chartLabel.value,
        chartData: chartData.value,
      });
    }
  };

  function monthly_sale_graphs_handler() {
    chartUpdate(
      gameState.monthlySale.value,
      formatDate(gameState.month.value, gameState.year.value)
    );
    gameState.monthlySale.value = 0;
    logMessage("Receita do mês atualizada!");
  }
  function logMessage(message) {
    gameState.logs.value.push(
      `[${new Date().toLocaleTimeString()}] ${message}`
    );
  }
  function automation_handler() {
    if (
      gameState.availableCopper.value >=
      gameState.copperQtPerMeter * gameState.workers.value
    ) {
      gameState.copperWireinMeter.value += 1 * gameState.workers.value;
      gameState.lifeTimeCopperWire.value += 1 * gameState.workers.value;
      gameState.availableCopper.value -=
        1 * gameState.workers.value * gameState.copperQtPerMeter;
    } else {
      //Nothing yet.
    }
  }
  function buy_refined_copper() {
    transaction.spend(gameState.kgOfCopper * gameState.copperBulkAmount.value)
      ? (gameState.availableCopper.value +=
          1.0 * gameState.copperBulkAmount.value)
      : alert("Not enough funds to buy this amount.");
  }
  function increaseBulk() {
    if (gameState.copperBulkAmount.value < 10) {
      gameState.copperBulkAmount.value++;
    }
  }

  function decreaseBulk() {
    if (gameState.copperBulkAmount.value >= 2) {
      gameState.copperBulkAmount.value--;
    }
  }
  function buy_worker() {
    transaction.spend(gameState.workersPrice.value)
      ? gameState.workers.value++
      : alert("Not enough funds to hire more workers.");
  }
  function buy_marketing() {
    transaction.spend(gameState.marketingPrice.value)
      ? gameState.marketing.value++
      : alert("Not enough funds to invest in marketing.");
    gameState.marketingPrice.value = getMarketingPrice(
      gameState.marketing.value
    );
  }
  function getMarketingPrice(marketingLevel) {
    return Math.floor(10 * Math.pow(marketingLevel, 3));
  }
  function time_handler() {
    if (gameState.month.value == 12 && gameState.week.value == 4) {
      monthly_sale_graphs_handler();
      gameState.year.value++;
      gameState.month.value = 1;
      gameState.week.value = 1;
    } else if (gameState.week.value == 4) {
      monthly_sale_graphs_handler();
      gameState.month.value++;
      gameState.week.value = 1;
    } else {
      gameState.week.value++;
    }
  }
  function ticks_events(tick) {
    return gameState.ticks.value % tick === 0;
  }

  function buy_chance(price, marketing = 0) {
    const priceFactor = Math.exp(-((price - 0.5) / 0.2));

    // Exponencial suave com base 1.03, dobra em ~24 níveis
    const marketingFactor = Math.pow(1.03, marketing);
    return priceFactor * marketingFactor;
  }

  const currentDemand = computed(() => {
    return buy_chance(gameState.priceOfCopper.value, gameState.marketing.value);
  });

  function buy_simulation_per_tick() {
    const level = gameState.marketing.value;

    // Base mínima e máxima ajustadas para dar mais aleatoriedade
    const maxBase = 10 * Math.pow(2, level - 1);
    const minBase = Math.floor(maxBase / 2.5);

    const quantity =
      Math.floor(Math.random() * (maxBase - minBase + 1)) + minBase;

    const sellAmount = Math.min(quantity, gameState.copperWireinMeter.value);

    if (sellAmount > 0) {
      console.log(`Sold products: ${sellAmount}`);
      gameState.copperWireinMeter.value -= sellAmount;

      const revenue = sellAmount * gameState.priceOfCopper.value;
      gameState.funds.value += revenue;
      gameState.monthlySale.value += revenue;
    }
  }

  function makeCopperWire() {
    if (gameState.availableCopper.value >= gameState.copperQtPerMeter) {
      gameState.availableCopper.value -= gameState.copperQtPerMeter;
      gameState.copperWireinMeter.value++;
      gameState.lifeTimeCopperWire.value++;
    }
  }
  function increasePrice() {
    gameState.priceOfCopper.value += 0.01;
  }
  function decreasePrice() {
    if (gameState.priceOfCopper.value > Number.EPSILON) {
      gameState.priceOfCopper.value -= 0.01;
      gameState.priceOfCopper.value = Math.max(
        0,
        gameState.priceOfCopper.value
      );
    }
  }
  return {
    currentDemand,
    makeCopperWire,
    logMessage,
    buy_worker,
    buy_marketing,
    buy_refined_copper,
    increasePrice,
    decreasePrice,
    increaseBulk,
    decreaseBulk,
  };
}
