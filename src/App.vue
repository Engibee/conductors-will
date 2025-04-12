<script setup>
import { usePaperclipGame } from "./composables/usePaperclipGame.js";
import PerkCard from "./components/PerkCards.vue";
import { salesChart } from "./composables/usePaperclipGame.js";
const { graficoCanvas } = salesChart();
import { formatPrice, formatDate, formatNumber } from "./utils/helpers/format.js";
import { buyPerk, hasMachinery } from "./composables/Perks.js";
const {
  copperWireinMeter,
  lifeTimeCopperWire,
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
  <div class="top-bar">
    <div class="totalCopper">Copper Wire made: {{ formatNumber(lifeTimeCopperWire) }}m</div>
  </div>
  <div class="containers">
    <div class="card business">
      <h3>Stock: {{ copperWireinMeter }} meters</h3>
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
    <transition name="fade-slide">
      <div v-if="hasMachinery" class="card automation">
        <h3>Automation</h3>
        <div class="autoinfo">
          <button @click="buy_worker">Buy worker</button>
          <p>Price: ${{ formatPrice(workersPrice) }}</p>
          <p>Amount of workers: {{ workers }}</p>
        </div>
        <p class="mini_info">Generates 1 meter of copper per tick(second)</p>
      </div>
    </transition>
    <div class="card terminal">
      <div class="time">
        📅 Week: {{ week }} | 📆 Month: {{ formatDate(month) }} | 📅 Year:
        {{ year }}
      </div>
      <div v-for="(msg, index) in logs" :key="index" class="log-message">
        {{ msg }}
      </div>
    </div>
    <div class="card sellchart">
      <canvas ref="graficoCanvas"></canvas>
    </div>
    <div :class="{ card: true, lab: true, 'lab-moved': hasMachinery }">
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
        <PerkCard
          v-if="!hasMachinery && lifeTimeCopperWire >= 100"
          perk-id="machinery"
          title="Garage Factory"
          description="Automatize the production of copper wire"
          :price="100.0"
        />
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped></style>
