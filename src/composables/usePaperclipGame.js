import { onMounted, onUnmounted, computed, watch } from "vue";
import { formatDate } from "../utils/helpers/format.js";
import { checkStakeGameBegin } from "../utils/helpers/checkers.js";
import * as transaction from "../utils/helpers/transactionHandle.js";
import {
  stakeHoldingTrading,
} from "./gameState.js";
import { useGameStore } from "../stores/gameStore.js";
import { useContinentRealEstateStore } from "../stores/realEstateStore.js";
import { usePerkStore } from "../stores/perkStore.js";
import { useChartStore } from "../stores/chartStore.js";

let intervalo = null;

export function usePaperclipGame() {
  onMounted(() => {
    checkStakeGameBegin() ? generateInitialStakeholding() : null;
    realEstate.selectedContinent.name = "No continent selected";
    console.log(`O contador foi montado.`);
  });
  onUnmounted(() => {
    // Limpa o intervalo quando o componente for destruído
    clearInterval(intervalo);
    console.log(`O contador foi limpado/destruído.`);
  });

  const game = useGameStore();
  const realEstate = useContinentRealEstateStore();
  const chart = useChartStore();
  const perks = usePerkStore();

  // Watch for tick changes instead of creating them
  watch(() => game.ticks, (newTicks, oldTicks) => {
    if (newTicks !== oldTicks) {
      update_tick();
      console.log(game.ticks);
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
      if (perks.hasRefinery) {
        refinery_handler();
      }
    }
  };

  function generateOrePerStake() {
    const oreTransaction = Math.pow(stakeHoldingTrading.You, 1.1) * 1000;

    game.availableCopperOre += oreTransaction;
    game.globalCopperOre -= oreTransaction;

    if (perks.hasRefinery){
      if (game.availableCopperOre >= 100){
        game.availableCopperOre -= 100;
        game.availableCopper += 1;
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
      game.monthlySale,
      formatDate(game.month, game.year)
    );
    game.monthlySale = 0;
    logMessage("Monthly receipt updated!");
  }
  function logMessage(message) {
    // Limit log size to prevent memory issues
    if (game.logs.length > 50) {
      game.logs.shift(); // Remove oldest log
    }
    game.logs.push(`[${new Date().toLocaleTimeString()}] ${message}`);
  }
  function automation_handler() {
    if (
      game.availableCopper >=
      game.copperQtPerMeter *
        (game.workers + realEstate.totalFactories * 100)
    ) {
      game.copperWireinMeter +=
        1 * (game.workers + realEstate.totalFactories * 100);
      game.lifeTimeCopperWire +=
        1 * (game.workers + realEstate.totalFactories * 100);
      game.availableCopper -=
        1 *
        (game.workers + realEstate.totalFactories * 100) *
        game.copperQtPerMeter;
    }
  }
  function buy_refined_copper() {
    transaction.spend(game.kgOfCopper * game.copperBulkAmount)
      ? (game.availableCopper += 1.0 * game.copperBulkAmount)
      : alert("Not enough funds to buy this amount.");
  }
  function increaseBulk() {
    if (game.copperBulkAmount < 10) {
      game.copperBulkAmount++;
    }
  }

  function decreaseBulk() {
    if (game.copperBulkAmount >= 2) {
      game.copperBulkAmount--;
    }
  }
  function buy_worker() {
    transaction.spend(game.workersPrice)
      ? game.workers++
      : alert("Not enough funds to hire more workers.");
  }
  function buy_marketing() {
    transaction.spend(game.marketingPrice)
      ? game.marketing++
      : alert("Not enough funds to invest in marketing.");
    game.marketingPrice = getMarketingPrice(game.marketing);
  }
  function getMarketingPrice(marketingLevel) {
    return Math.floor(10 * Math.pow(marketingLevel, 3));
  }
  function time_handler() {
    if (game.month == 12 && game.week == 4) {
      monthly_sale_graphs_handler();
      game.year++;
      game.month = 1;
      game.week = 1;
    } else if (game.week == 4) {
      monthly_sale_graphs_handler();
      game.month++;
      game.week = 1;
    } else {
      game.week++;
    }
  }
  function rentedBuildingHandler() {
    if (perks.hasRealEstate && realEstate.totalRentedBuildings > 0) {
      game.funds += realEstate.totalRentedBuildings * 200;
      game.monthlySale += realEstate.totalRentedBuildings * 200;
      logMessage(
        `Your monthly rent income: $${(
          realEstate.totalRentedBuildings * 200
        ).toLocaleString()}!`
      );
    }
  }
  function ticks_events(tick) {
    return game.ticks % tick === 0;
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
      game.priceOfCopper,
      game.marketing,
      game.demandModifier ?? 1
    );
  });

  function buy_simulation_per_tick() {
    const marketingLevel = game.marketing;

    const maxSales =
      (99.999 * Math.pow(marketingLevel, 2) + 10) * game.maxSaleModifier;
    const demand = currentDemand.value;

    const baseSales = maxSales * 0.5 * demand;
    const fluctuation = baseSales * (Math.random() * 0.2 - 0.1); // ±10%
    const estimatedSales = Math.max(0, Math.floor(baseSales + fluctuation));

    const finalSales = Math.min(estimatedSales, game.copperWireinMeter);

    if (finalSales > 0) {
      console.log(
        `Sold products: ${finalSales}, Max sale: ${maxSales}, Max sale factor: ${game.maxSaleModifier}`
      );
      game.copperWireinMeter -= finalSales;

      const revenue = finalSales * game.priceOfCopper;
      game.funds += revenue;
      game.monthlySale += revenue;
    }
  }

  function makeCopperWire() {
    if (game.availableCopper >= game.copperQtPerMeter) {
      game.availableCopper -= game.copperQtPerMeter;
      game.copperWireinMeter++;
      game.lifeTimeCopperWire++;
    }
  }
  function increasePrice() {
    game.priceOfCopper += 0.01;
  }
  function decreasePrice() {
    if (game.priceOfCopper > Number.EPSILON) {
      game.priceOfCopper -= 0.01;
      game.priceOfCopper = Math.max(0, game.priceOfCopper);
    }
  }
  // Add this function to handle refinery workers
  function assignRefinery() {
    // If we have available workers, assign one to refinery
    if (game.workers > 0) {
      game.workers--;
      game.refiners = (game.refiners || 0) + 1;
    }
  }

  // Update the refinery logic in your tick handler
  function refinery_handler() {
    if (game.refiners && game.refiners > 0) {
      const maxRefine = Math.min(
        game.availableCopperOre, 
        game.refiners * 100
      );
      
      if (maxRefine >= 100) {
        const batches = Math.floor(maxRefine / 100);
        game.availableCopperOre -= batches * 100;
        game.availableCopper += batches;
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
