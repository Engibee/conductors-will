import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";

//STOCK HANDLE
export const gameState = reactive({
  //STOCK HANDLE
  funds: 150,
  lifeTimeCopperWire: 0,
  copperWireinMeter: 0,
  availableCopper: 10,
  workers: 0,

  //PRICES HANDLE
  copperQtPerMeter: 0.02232,
  kgOfCopper: 9.795,
  copperBulkAmount: 1,
  priceOfCopper: 0.5,
  workersPrice: 35.0,
  monthlySale: 0,
  marketing: 1,
  marketingPrice: 10,

  //TIME HANDLE
  intervalo: null,
  ticks: 0,
  week: 1,
  month: 1,
  year: 1,

  //LISTS
  logs: [],
});

export const perkState = reactive({
  hasMachinery: false,
  hasContractProvider: false,
  hasRealState: false,
});

export const selectedContinent = reactive({
  name: "No continent selected",
});