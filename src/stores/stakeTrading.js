import { defineStore } from 'pinia'

export const useResourcesStore = defineStore('resources', {
  state: () => ({
    funds: 1,
    copperWireinMeter: 0.50,
    rentedBuilding: 10000,
    factories: 10000,
  }),
  persist: true,
})

export const useStakeHoldingTradingStore = defineStore('stakeHoldingTrading', {
  state: () => ({
    selectedOrganization: "Nothing selected",
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
    fundsOffer: 0,
    copperWireinMeterOffer: 0,
    rentedBuildingOffer: 0,
    factoriesOffer: 0,
  }),
  persist: true,
})