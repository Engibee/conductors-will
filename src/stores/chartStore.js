import { defineStore } from 'pinia'

export const useChartStore = defineStore('chart', {
  state: () => ({
    chartLabel: [],
    chartData: [],
  }),

  persist: true, // opcional, só se quiser manter dados após reload
})