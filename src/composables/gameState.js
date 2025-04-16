import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";

//STOCK HANDLE
export const gameState = {
  //STOCK HANDLE
  funds: ref(30),
  lifeTimeCopperWire: ref(0),
  copperWireinMeter: ref(0),
  availableCopper: ref(10),
  workers: ref(0),

  //PRICES HANDLE
  copperQtPerMeter: 0.02232,
  kgOfCopper: 9.795,
  copperBulkAmount: ref(1),
  priceOfCopper: ref(0.5),
  workersPrice: ref(35.0),
  monthlySale: ref(0),
  marketing: ref(1),
  marketingPrice: ref(10),

  //TIME HANDLE
  intervalo: null,
  ticks: ref(0),
  week: ref(1),
  month: ref(1),
  year: ref(1),

  //LISTS
  logs: ref([]),
};

export const perkState = {
  hasMachinery: ref(false),
  hasContractProvider: ref(false),
}
