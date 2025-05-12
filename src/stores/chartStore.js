import { defineStore } from 'pinia'

export const useChartStore = defineStore('chart', {
  state: () => ({
    chartLabel: [],
    chartData: [],
  }),
  actions: {
    resetStore() {
      this.$reset()
    }
  },
  persist: true,
})