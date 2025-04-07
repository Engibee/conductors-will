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
  marketing,
  marketingPrice,
  currentDemand,
  logs,
  week,
  month,
  year,
  perks,
  FabricarPaperclip,
  logMessage,
  buy_worker,
  buy_refined_copper,
  buy_marketing,
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
        Demand: <strong>{{ formatPrice(currentDemand) }}</strong>
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
    <div class="card lab">
      <h4 class="labtitle">Lab Research</h4>
      <div class="marketing-container">
        <div class="marketing-bar">
          <div
            class="marketing-fill"
            :style="{ height: marketing + '%' }"
          ></div>
        </div>
        <div class="marketing-info">
          <p>Marketing: {{ marketing }}%</p>
          <button @click="buy_marketing">Buy</button>
          <p>Price: ${{ formatPrice(marketingPrice) }}</p>
        </div>
      </div>
      <div class="perks-container">
        <div v-if="perks.unlocked.discountPerk" class="perk-box">
          <p>
            5% discount on marketing<br />Never leave your marketing level below
            5%
          </p>
          <p>Price: {{ discountPerkPrice }}</p>
          <button @click="buyDiscountPerk">Buy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped></style>
