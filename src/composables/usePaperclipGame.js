import { ref, reactive, onMounted, onUnmounted, computed, watch, toRaw } from "vue";
import { saveGame, loadGame, clearGame } from "./localStorage";
import { formatDate } from "../utils/helpers/format.js";
import * as transaction from "../utils/helpers/transactionHandle.js";
import { gameState,perkState,selectedContinent } from "./gameState.js";
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
    const data = loadGame();
    if (data) {
      Object.assign(gameState, data.state);
      Object.assign(perkState, data.perkState);
      Object.assign(selectedContinent, data.selectedContinent);
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
        state: toRaw(gameState),
        perkState: toRaw(perkState),
        selectedContinent: toRaw(selectedContinent),
        chartLabel: chartLabel.value,
        chartData: chartData.value,
      });
    }
  };

  function monthly_sale_graphs_handler() {
    chartUpdate(
      gameState.monthlySale,
      formatDate(gameState.month, gameState.year)
    );
    gameState.monthlySale = 0;
    logMessage("Monthly receipt updated!");
  }
  function logMessage(message) {
    gameState.logs.push(
      `[${new Date().toLocaleTimeString()}] ${message}`
    );
  }
  function automation_handler() {
    if (
      gameState.availableCopper >=
      gameState.copperQtPerMeter * gameState.workers
    ) {
      gameState.copperWireinMeter += 1 * gameState.workers;
      gameState.lifeTimeCopperWire += 1 * gameState.workers;
      gameState.availableCopper -=
        1 * gameState.workers * gameState.copperQtPerMeter;
    } else {
      //Nothing yet.
    }
  }
  function buy_refined_copper() {
    transaction.spend(gameState.kgOfCopper * gameState.copperBulkAmount)
      ? (gameState.availableCopper +=
          1.0 * gameState.copperBulkAmount)
      : alert("Not enough funds to buy this amount.");
  }
  function increaseBulk() {
    if (gameState.copperBulkAmount < 10) {
      gameState.copperBulkAmount++;
    }
  }

  function decreaseBulk() {
    if (gameState.copperBulkAmount >= 2) {
      gameState.copperBulkAmount--;
    }
  }
  function buy_worker() {
    transaction.spend(gameState.workersPrice)
      ? gameState.workers++
      : alert("Not enough funds to hire more workers.");
  }
  function buy_marketing() {
    transaction.spend(gameState.marketingPrice)
      ? gameState.marketing++
      : alert("Not enough funds to invest in marketing.");
    gameState.marketingPrice = getMarketingPrice(
      gameState.marketing
    );
  }
  function getMarketingPrice(marketingLevel) {
    return Math.floor(10 * Math.pow(marketingLevel, 3));
  }
  function time_handler() {
    if (gameState.month == 12 && gameState.week == 4) {
      monthly_sale_graphs_handler();
      gameState.year++;
      gameState.month = 1;
      gameState.week = 1;
    } else if (gameState.week == 4) {
      monthly_sale_graphs_handler();
      gameState.month++;
      gameState.week = 1;
    } else {
      gameState.week++;
    }
  }
  function ticks_events(tick) {
    return gameState.ticks % tick === 0;
  }

  function buy_chance(price, marketing = 0) {
    const priceFactor = Math.exp(-((price - 0.5) / 0.2));

    // Exponencial suave com base 1.03, dobra em ~24 níveis
    const marketingFactor = Math.pow(1.03, marketing);
    return priceFactor * marketingFactor;
  }

  const currentDemand = computed(() => {
    return buy_chance(gameState.priceOfCopper, gameState.marketing);
  });

  function buy_simulation_per_tick() {
    const level = gameState.marketing;

    // Base mínima e máxima ajustadas para dar mais aleatoriedade
    const maxBase = 10 * Math.pow(2, level - 1);
    const minBase = Math.floor(maxBase / 2.5);

    const quantity =
      Math.floor(Math.random() * (maxBase - minBase + 1)) + minBase;

    const sellAmount = Math.min(quantity, gameState.copperWireinMeter);

    if (sellAmount > 0) {
      console.log(`Sold products: ${sellAmount}`);
      gameState.copperWireinMeter -= sellAmount;

      const revenue = sellAmount * gameState.priceOfCopper;
      gameState.funds += revenue;
      gameState.monthlySale += revenue;
    }
  }

  function makeCopperWire() {
    if (gameState.availableCopper >= gameState.copperQtPerMeter) {
      gameState.availableCopper -= gameState.copperQtPerMeter;
      gameState.copperWireinMeter++;
      gameState.lifeTimeCopperWire++;
    }
  }
  function increasePrice() {
    gameState.priceOfCopper += 0.01;
  }
  function decreasePrice() {
    if (gameState.priceOfCopper > Number.EPSILON) {
      gameState.priceOfCopper -= 0.01;
      gameState.priceOfCopper = Math.max(
        0,
        gameState.priceOfCopper
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
