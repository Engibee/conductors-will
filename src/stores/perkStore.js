import { defineStore } from 'pinia'

export const usePerkStore = defineStore('perk', {
  state: () => ({
    hasMachinery: false,
    hasContractProvider: false,
    hasRealEstate: false,
    hasPatentLogo: false,
    hasRefinery: false,
  }),
  persist: true, // Isso ativa o salvamento local com pinia-plugin-persistedstate
})
