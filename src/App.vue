<script setup>
import { usePaperclipGame } from './composables/usePaperclipGame.js'
import { formatPrice } from './utils/helpers/formatPrice.js';
const { copperWireinMeter, funds, priceOfCopper, availableCopper, workers, week, month, year, FabricarPaperclip, buy_worker, buy_refined_copper, buy_chance, increasePrice, decreasePrice } = usePaperclipGame()
</script>

<template>
  <div class="time">
  📅 Week: {{ week }} | 📆 Month: {{ month }} | 📅 Year: {{ year }}
  </div>
    <div class="card business">
      <h3>Copper wire: {{ copperWireinMeter }} meters</h3>
      <button @click="FabricarPaperclip">Make Copper Wire</button>
      
      <h5>Business</h5>
      <p>Funds: ${{ formatPrice(funds) }}</p>
      <p class="sellprice">
        <button @click="decreasePrice" class="small-btn">-</button>
        <button @click="increasePrice" class="small-btn">+</button>
        Selling price: ${{ formatPrice(priceOfCopper) }}
      </p>
      <p>Demanda: <strong>{{ formatPrice(buy_chance(priceOfCopper)) }}</strong></p>
      <p>Refined Copper: {{ formatPrice(availableCopper) }} kg</p>
      <button @click="buy_refined_copper">Buy Refined Copper</button>
      <p class="mini_info">Price: $9.795</p>
    </div>
    <div class="card automation">
      <h3>Automation</h3>
      <div class="autoinfo">
        <button @click="buy_worker">Buy worker</button>
        <p>Price: NaN</p>
        <p>Amount of workers: {{ workers }}</p>
      </div>
      <p class="mini_info">Generates 1 meter of copper per tick(second)</p>
    </div>
</template>

<script>
</script>

<style scoped>
</style>
