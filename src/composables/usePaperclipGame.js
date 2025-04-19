import {
  onMounted,
  onUnmounted,
  computed,
  watch,
  toRaw,
} from "vue";
import { saveGame, loadGame, clearGame } from "./localStorage";
import { formatDate } from "../utils/helpers/format.js";
import * as transaction from "../utils/helpers/transactionHandle.js";
import { gameState, perkState, selectedContinent, chart, continentRealEstate } from "./gameState.js";

let intervalo = null;

export function usePaperclipGame() {
  onMounted(() => {
    intervalo = setInterval(update_tick, 1000);
    console.log(`O contador foi montado.`);
    clearGame();
    const data = loadGame();
    if (data) {
      Object.assign(gameState, data.state);
      Object.assign(perkState, data.perkState);
      Object.assign(selectedContinent, data.selectedContinent);
      Object.assign(chart, data.chartInstance);
      Object.assign(continentRealEstate, data.continentRealEstate);
    }
  });
  onUnmounted(() => {
    // Limpa o intervalo quando o componente for destruído
    clearInterval(intervalo);
    console.log(`O contador foi limpado/destruído.`);
  });

  const update_tick = () => {
    if (ticks_events(40)){
      rentedBuildingHandler();
    }
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
        chartInstance: toRaw(chart),
        continentRealEstate: toRaw(continentRealEstate),
      });
    }
  };

  function chartUpdate(newSale, month) {
    chart.chartLabel.push(month);
    chart.chartData.push(newSale);
  }

  function monthly_sale_graphs_handler() {
    chartUpdate(
      gameState.monthlySale,
      formatDate(gameState.month, gameState.year)
    );
    gameState.monthlySale = 0;
    logMessage("Monthly receipt updated!");
  }
  function logMessage(message) {
    gameState.logs.push(`[${new Date().toLocaleTimeString()}] ${message}`);
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
      ? (gameState.availableCopper += 1.0 * gameState.copperBulkAmount)
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
    gameState.marketingPrice = getMarketingPrice(gameState.marketing);
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
  function rentedBuildingHandler() {
    gameState.funds += gameState.rentedBuilding * 200;
    logMessage(
      `Your monthly rent income: $${(gameState.rentedBuilding * 200).toLocaleString()}!`
    );
  }
  function ticks_events(tick) {
    return gameState.ticks % tick === 0;
  }

  function buy_chance(price, marketing = 0, externalModifier = 1) {
    const priceFactor = Math.exp(-((price - 0.5) / 0.2));
    const marketingBonus = 1 + marketing * 0.005; // 0.5 nível = +2.5%
    return priceFactor * marketingBonus * externalModifier;
  }

  const currentDemand = computed(() => {
    return buy_chance(
      gameState.priceOfCopper,
      gameState.marketing,
      gameState.demandModifier ?? 1
    );
  });

  function buy_simulation_per_tick() {
    const marketingLevel = gameState.marketing;

    const maxSales = 10 + ((marketingLevel * 30) * gameState.maxSaleModifier);
    const demand = currentDemand.value;

    const baseSales = maxSales * 0.5 * demand;
    const fluctuation = baseSales * (Math.random() * 0.2 - 0.1); // ±10%
    const estimatedSales = Math.max(0, Math.floor(baseSales + fluctuation));

    const finalSales = Math.min(estimatedSales, gameState.copperWireinMeter);

    if (finalSales > 0) {
      console.log(`Sold products: ${finalSales}, Max sale: ${maxSales}, Max sale factor: ${gameState.maxSaleModifier}`);
      gameState.copperWireinMeter -= finalSales;

      const revenue = finalSales * gameState.priceOfCopper;
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
      gameState.priceOfCopper = Math.max(0, gameState.priceOfCopper);
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
