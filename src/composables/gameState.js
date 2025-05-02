import { ref, reactive, shallowReactive, onMounted, onUnmounted, computed, watch } from "vue";

//STOCK HANDLE
export const gameState = reactive({
  //PAUSE HANDLE
  isPaused: false,
  isStakeModalOpen: false,

  //STOCK HANDLE
  funds: 999999,
  lifeTimeCopperWire: 0,
  copperWireinMeter: 0,
  globalCopperOre: 1_000_000_000_000_000,
  availableCopper: 10,
  availableCopperOre: 0,
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

export const chart = shallowReactive({
  chartLabel: [],
  chartData: [],
});

export const resourcesValue = reactive({
  funds: 1,
  copperWireinMeter: 0.50,
  rentedBuilding: 10000,
  factories: 10000,
});

export const stakeHoldingTrading = reactive({
  //STAKEHOLDER INDEX
  selectedOrganization: "Nothing selected",

  //STAKE HANDLE
  Governments: {
    stake: 0,
    valuationWeight: {
      funds: 2.0,
      copper: 0.5,
      residential: 1.0,
      factories: 1.0,
    },
  },
  TechCorporations: {
    stake: 0,
    valuationWeight: {
      funds: 1.0,
      copper: 2.5,
      residential: 1.0,
      factories: 1.0,
    },
  },
  FinancialFunds: {
    stake: 0,
    valuationWeight: {
      funds: 1.0,
      copper: 1.0,
      residential: 2.0,
      factories: 2.0,
    },
  },
  NGOs: {
    stake: 0,
    valuationWeight: {
      funds: 1.0,
      copper: 1.0,
      residential: 2.0,
      factories: 2.0,
    },
  },
  You: 0,

  //TRADING HANDLE
  fundsOffer: 0,
  copperWireinMeterOffer: 0,
  rentedBuildingOffer: 0,
  factoriesOffer: 0,
});

export const perkState = reactive({
  hasMachinery: false,
  hasContractProvider: false,
  hasRealEstate: false,
  hasPatentLogo: false,
  hasRefinery: false,
});

export const selectedContinent = reactive({
  name: "No continent selected",
});

// Computados para somar separadamente
export const totalFactories = computed(() =>
  Object.values(continentRealEstate).reduce((sum, continent) => sum + continent.factories, 0)
);

export const totalAvailableBuildings = computed(() =>
  Object.values(continentRealEstate).reduce((sum, continent) => sum + continent.availableBuildings, 0)
);

export const totalRentedBuildings = computed(() =>
  Object.values(continentRealEstate).reduce((sum, continent) => sum + continent.rentedBuildings, 0)
);
