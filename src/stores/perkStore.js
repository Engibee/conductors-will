import { defineStore } from 'pinia'

export const usePerkStore = defineStore('perk', {
  state: () => ({
    hasMachinery: false,
    hasContractProvider: false,
    hasRealEstate: false,
    hasPatentLogo: false,
    hasRefinery: false,
  }),
  actions: {
    resetStore() {
      this.$reset()
    }
  },
  persist: true,
})
