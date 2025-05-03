import { onMounted, onUnmounted, computed, toRaw, watch } from "vue";
import { saveGame, loadGame, clearGame } from "./localStorage";
import { formatDate } from "../utils/helpers/format.js";
import { checkStakeGameBegin } from "../utils/helpers/checkers.js";
import * as transaction from "../utils/helpers/transactionHandle.js";
import {
  gameState,
  perkState,
  selectedContinent,
  chart,
  continentRealEstate,
  stakeHoldingTrading,
  resourcesValue,
  totalFactories,
  totalAvailableBuildings,
  totalRentedBuildings,
} from "./gameState.js";

let intervalo = null;

export function usePaperclipGame() {
  onMounted(() => {
    checkStakeGameBegin() ? generateInitialStakeholding() : null;
    console.log(`O contador foi montado.`);
    
    // Load game data
    const data = loadGame();
    if (data) {
      Object.assign(gameState, data.state);
      Object.assign(perkState, data.perkState);
      Object.assign(selectedContinent, data.selectedContinent);
      Object.assign(chart, data.chartInstance);
      Object.assign(continentRealEstate, data.continentRealEstate);
      Object.assign(stakeHoldingTrading, data.stakeHoldingTrading);
      Object.assign(resourcesValue, data.resourcesValue);
    }
  });
  onUnmounted(() => {
    // Limpa o intervalo quando o componente for destruído
    clearInterval(intervalo);
    console.log(`O contador foi limpado/destruído.`);
  });

  // Watch for tick changes instead of creating them
  watch(() => gameState.ticks, (newTicks, oldTicks) => {
    if (newTicks !== oldTicks) {
      update_tick();
      console.log(gameState.ticks);
    }
  });

  const update_tick = () => {
    if (ticks_events(40)) {
      rentedBuildingHandler();
    }
    if (ticks_events(10)) {
      time_handler();
    }
    if (ticks_events(5)) {
      buy_simulation_per_tick();
    }
    if (ticks_events(1)) {
      generateOrePerStake();
      automation_handler();
      if (perkState.hasRefinery) {
        refinery_handler();
      }
      throttledSave();
    }
  };

  function generateOrePerStake() {
    const oreTransaction = Math.pow(stakeHoldingTrading.You, 1.1) * 1000;

    gameState.availableCopperOre += oreTransaction;
    gameState.globalCopperOre -= oreTransaction;

    if (perkState.hasRefinery){
      if (gameState.availableCopperOre >= 100){
        gameState.availableCopperOre -= 100;
        gameState.availableCopper += 1;
      }
    }
  }

  function generateInitialStakeholding() {
    const organizations = [
      "Governments",
      "TechCorporations",
      "FinancialFunds",
      "NGOs",
    ];

    const randomValues = organizations.map(() => Math.random());
    const total = randomValues.reduce((sum, val) => sum + val, 0);

    organizations.forEach((org, i) => {
      stakeHoldingTrading[org].stake = parseFloat(
        ((randomValues[i] / total) * 100).toFixed(2)
      );
    });

    stakeHoldingTrading.You = 0.0;
  }

  function chartUpdate(newSale, month) {
    // Limit chart data points to prevent performance issues
    if (chart.chartLabel.length > 50) {
      chart.chartLabel.shift();
      chart.chartData.shift();
    }
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
    // Limit log size to prevent memory issues
    if (gameState.logs.length > 50) {
      gameState.logs.shift(); // Remove oldest log
    }
    gameState.logs.push(`[${new Date().toLocaleTimeString()}] ${message}`);
  }
  function automation_handler() {
    if (
      gameState.availableCopper >=
      gameState.copperQtPerMeter *
        (gameState.workers + totalFactories.value * 100)
    ) {
      gameState.copperWireinMeter +=
        1 * (gameState.workers + totalFactories.value * 100);
      gameState.lifeTimeCopperWire +=
        1 * (gameState.workers + totalFactories.value * 100);
      gameState.availableCopper -=
        1 *
        (gameState.workers + totalFactories.value * 100) *
        gameState.copperQtPerMeter;
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
    if (perkState.hasRealEstate && totalRentedBuildings.value > 0) {
      gameState.funds += totalRentedBuildings.value * 200;
      gameState.monthlySale += totalRentedBuildings.value * 200;
      logMessage(
        `Your monthly rent income: $${(
          totalRentedBuildings.value * 200
        ).toLocaleString()}!`
      );
    }
  }
  function ticks_events(tick) {
    return gameState.ticks % tick === 0;
  }

  function buy_chance(price, marketing = 0, externalModifier = 1) {
    const priceFactor = Math.exp(-((price - 0.5) / 0.2));
    const marketingBonus = 1 + marketing * 0.005; // 0.5 nível = +2.5%
    return priceFactor * marketingBonus * externalModifier;
  }

  // Cache expensive calculations
  const currentDemand = computed(() => {
    // This calculation runs on every render
    return buy_chance(
      gameState.priceOfCopper,
      gameState.marketing,
      gameState.demandModifier ?? 1
    );
  });

  function buy_simulation_per_tick() {
    const marketingLevel = gameState.marketing;

    const maxSales =
      (99.999 * Math.pow(marketingLevel, 2) + 10) * gameState.maxSaleModifier;
    const demand = currentDemand.value;

    const baseSales = maxSales * 0.5 * demand;
    const fluctuation = baseSales * (Math.random() * 0.2 - 0.1); // ±10%
    const estimatedSales = Math.max(0, Math.floor(baseSales + fluctuation));

    const finalSales = Math.min(estimatedSales, gameState.copperWireinMeter);

    if (finalSales > 0) {
      console.log(
        `Sold products: ${finalSales}, Max sale: ${maxSales}, Max sale factor: ${gameState.maxSaleModifier}`
      );
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
  // Throttle save operations
  let saveTimeout = null;
  function throttledSave() {
    if (saveTimeout) return;
    saveTimeout = setTimeout(() => {
      saveGame({
        state: toRaw(gameState),
        perkState: toRaw(perkState),
        selectedContinent: toRaw(selectedContinent),
        chartInstance: toRaw(chart),
        continentRealEstate: toRaw(continentRealEstate),
        stakeHoldingTrading: toRaw(stakeHoldingTrading),
        resourcesValue: toRaw(resourcesValue),
      });
      saveTimeout = null;
    }, 5000); // Save at most every 5 seconds
  }
  // Add this function to handle refinery workers
  function assignRefinery() {
    // If we have available workers, assign one to refinery
    if (gameState.workers > 0) {
      gameState.workers--;
      gameState.refiners = (gameState.refiners || 0) + 1;
    }
  }

  // Update the refinery logic in your tick handler
  function refinery_handler() {
    if (gameState.refiners && gameState.refiners > 0) {
      const maxRefine = Math.min(
        gameState.availableCopperOre, 
        gameState.refiners * 100
      );
      
      if (maxRefine >= 100) {
        const batches = Math.floor(maxRefine / 100);
        gameState.availableCopperOre -= batches * 100;
        gameState.availableCopper += batches;
      }
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
    assignRefinery, // Add this to the returned functions
  };
}
