<script setup>
import { usePaperclipGame } from "./composables/usePaperclipGame.js";
import { salesChart } from "./composables/usePaperclipGame.js";
const { graficoCanvas } = salesChart();
import { formatPrice } from "./utils/helpers/formatPrice.js";
const {
  copperWireinMeter,
  funds,
  priceOfCopper,
  availableCopper,
  workers,
  workersPrice,
  logs,
  week,
  month,
  year,
  FabricarPaperclip,
  logMessage,
  buy_worker,
  buy_refined_copper,
  buy_chance,
  increasePrice,
  decreasePrice,
} = usePaperclipGame();
</script>

<template>
  <div class="containers">
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
      <p>
        Demanda: <strong>{{ formatPrice(buy_chance(priceOfCopper)) }}</strong>
      </p>
      <p>Refined Copper: {{ formatPrice(availableCopper) }} kg</p>
      <button @click="buy_refined_copper">Buy Refined Copper</button>
      <p class="mini_info">Price: $9.795</p>
    </div>
    <div class="card automation">
      <h3>Automation</h3>
      <div class="autoinfo">
        <button @click="buy_worker">Buy worker</button>
        <p>Price: ${{ formatPrice(workersPrice) }}</p>
        <p>Amount of workers: {{ workers }}</p>
      </div>
      <p class="mini_info">Generates 1 meter of copper per tick(second)</p>
    </div>
    <div class="card terminal">
      <div class="time">
        📅 Week: {{ week }} | 📆 Month: {{ month }} | 📅 Year: {{ year }}
      </div>
      <div v-for="(msg, index) in logs" :key="index" class="log-message">
        {{ msg }}
      </div>
    </div>
    <div class="card sellchart">
      <canvas ref="graficoCanvas"></canvas>
    </div>
    <div class="card market">
      
    </div>
  </div>
</template>

<script></script>

<style scoped></style>
