// src/stores/continentRealEstate.js
import { defineStore } from "pinia";

export const useContinentRealEstateStore = defineStore("continentRealEstate", {
  state: () => ({
    selectedContinent: {
      name: "No continent selected",
    },

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
  }),

  getters: {
    totalFactories: (state) =>
      ["Asia", "Europe", "NorthAmerica", "SouthAmerica", "Africa", "Oceania"]
        .map((key) => state[key].factories)
        .reduce((sum, factories) => sum + factories, 0),

    totalAvailableBuildings: (state) =>
      ["Asia", "Europe", "NorthAmerica", "SouthAmerica", "Africa", "Oceania"]
        .map((key) => state[key].availableBuildings)
        .reduce((sum, val) => sum + val, 0),

    totalRentedBuildings: (state) =>
      ["Asia", "Europe", "NorthAmerica", "SouthAmerica", "Africa", "Oceania"]
        .map((key) => state[key].rentedBuildings)
        .reduce((sum, val) => sum + val, 0),
  },
  actions: {
    resetStore() {
      this.$reset()
    }
  },
  persist: true,
});
