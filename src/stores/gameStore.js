import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
  state: () => ({
    // PAUSE HANDLE
    isPaused: false,
    isStakeModalOpen: false,

    // STOCK HANDLE
    funds: 999999,
    lifeTimeCopperWire: 0,
    copperWireinMeter: 0,
    globalCopperOre: 1_000_000_000_000_000,
    availableCopper: 10,
    availableCopperOre: 0,
    workers: 0,

    // PRICES HANDLE
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

    // TIME HANDLE
    intervalo: null,
    ticks: 0,
    week: 1,
    month: 1,
    year: 1,

    // LISTS
    logs: [],
  }),

  actions: {
    pauseGame() {
      this.isPaused = true;
    },
    resumeGame() {
      this.isPaused = false;
    },
    log(msg) {
      this.logs.push(msg);
    },
    resetLogs() {
      this.logs = [];
    },
    resetStore() {
      this.$reset()
    },
  },
  persist: true,
});
