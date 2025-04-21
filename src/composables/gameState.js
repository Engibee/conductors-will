import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";

//STOCK HANDLE
export const gameState = reactive({
  //PAUSE HANDLE
  isPaused: false,
  isStakeModalOpen: false,

  //STOCK HANDLE
  funds: 20000,
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
  demandModifier: 1,
  maxSaleModifier: 1,

  //REAL ESTATE HANDLE
  availableBuildings: 0,
  factories: 0,
  rentedBuilding:0,

  //TIME HANDLE
  intervalo: null,
  ticks: 0,
  week: 1,
  month: 1,
  year: 1,

  //LISTS
  logs: [],
});

export const continentRealEstate = reactive({
  Asia: {
    availableBuildings: 0,
    factories: 0,
    rentedBuildings: 0,
    license: false,
  },
  Europe: {
    availableBuildings: 0,
    factories: 0,
    rentedBuildings: 0,
    license: false,
  },
  NorthAmerica: {
    availableBuildings: 0,
    factories: 0,
    rentedBuildings: 0,
    license: true,
  },
  SouthAmerica: {
    availableBuildings: 0,
    factories: 0,
    rentedBuildings: 0,
    license: false,
  },
  Africa: {
    availableBuildings: 0,
    factories: 0,
    rentedBuildings: 0,
    license: false,
  },
  Oceania: {
    availableBuildings: 0,
    factories: 0,
    rentedBuildings: 0,
    license: false,
  },
});

export const chart = reactive({
  chartLabel: [],
  chartData: [],
});

export const perkState = reactive({
  hasMachinery: false,
  hasContractProvider: false,
  hasRealState: false,
  hasPatentLogo: false,
});

export const selectedContinent = reactive({
  name: "No continent selected",
});