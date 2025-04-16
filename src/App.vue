<script setup>
import { usePaperclipGame } from "./composables/usePaperclipGame.js";
import { gameState, perkState } from "./composables/gameState.js";
import { salesChart } from "./composables/usePaperclipGame.js";
import PerkCard from "./components/PerkCards.vue";
import TickHandler from "./components/TickHandler.vue";
const { graficoCanvas } = salesChart();
import {
  formatPrice,
  formatDate,
  formatNumber,
} from "./utils/helpers/format.js";
const {
  currentDemand,
  makeCopperWire,
  buy_worker,
  buy_refined_copper,
  buy_marketing,
  increasePrice,
  decreasePrice,
  increaseBulk,
  decreaseBulk,
} = usePaperclipGame();
</script>

<template>
  <TickHandler />
  <div class="top-bar">
    <div class="totalCopper">
      Copper Wire made: {{ formatNumber(gameState.lifeTimeCopperWire.value) }}m
    </div>
  </div>
  <div class="containers">
    <div class="card business">
      <h3>Stock: {{ gameState.copperWireinMeter }} meters</h3>
      <button @click="makeCopperWire">Make Copper Wire</button>

      <h5>Business</h5>
      <p>Funds: ${{ formatPrice(gameState.funds.value) }}</p>
      <p class="sellprice">
        <button @click="decreasePrice" class="small-btn">-</button>
        <button @click="increasePrice" class="small-btn">+</button>
        Selling price: ${{ formatPrice(gameState.priceOfCopper.value) }}
      </p>
      <p>
        Demand: <strong>{{ formatPrice(currentDemand) }}</strong>
      </p>
      <p>
        Refined Copper: {{ formatPrice(gameState.availableCopper.value) }} kg
      </p>
      <div class="commodity">
        <button
          v-if="perkState.hasContractProvider.value"
          @click="decreaseBulk"
          class="bulk-button"
        >
          -
        </button>
        <button @click="buy_refined_copper">
          Buy Ref. Copper x {{ gameState.copperBulkAmount.value }}
        </button>
        <button
          v-if="perkState.hasContractProvider.value"
          @click="increaseBulk"
          class="bulk-button"
        >
          +
        </button>
      </div>
      <p class="mini_info">
        Price: ${{
          formatPrice(gameState.kgOfCopper * gameState.copperBulkAmount.value)
        }}
      </p>
    </div>
    <transition name="fade-slide">
      <div v-if="perkState.hasMachinery.value" class="card automation">
        <h3>Automation</h3>
        <div class="autoinfo">
          <button @click="buy_worker">Buy worker</button>
          <p>Price: ${{ formatPrice(gameState.workersPrice.value) }}</p>
          <p>Amount of workers: {{ gameState.workers }}</p>
        </div>
        <p class="mini_info">Generates 1 meter of copper per tick(second)</p>
      </div>
    </transition>
    <div class="card terminal">
      <div class="time">
        📅 Week: {{ gameState.week }} | 📆 Month:
        {{ formatDate(gameState.month.value) }} | 📅 Year:
        {{ gameState.year }}
      </div>
      <div
        v-for="(msg, index) in gameState.logs.value"
        :key="index"
        class="log-message"
      >
        {{ msg }}
      </div>
    </div>
    <div class="card sellchart">
      <canvas ref="graficoCanvas"></canvas>
    </div>
    <div
      :class="{
        card: true,
        lab: true,
        'lab-moved': perkState.hasMachinery.value,
      }"
    >
      <h4 class="labtitle">Lab Research</h4>
      <div class="marketing-container">
        <div class="marketing-bar">
          <div
            class="marketing-fill"
            :style="{ height: gameState.marketing.value + '%' }"
          ></div>
        </div>
        <div class="marketing-info">
          <p>Marketing: {{ gameState.marketing }}%</p>
          <button @click="buy_marketing">Buy</button>
          <p>Price: ${{ formatPrice(gameState.marketingPrice.value) }}</p>
        </div>
      </div>
      <div class="perks-container">
        <div class="industrial-perks">
          <PerkCard
            v-if="
              !perkState.hasMachinery.value &&
              gameState.lifeTimeCopperWire.value >= 0
            "
            perk-id="machinery"
            title="Garage Factory"
            description="Automatize the production of copper wire."
            :price="100.0"
          />
        </div>
        <div class="commodity-perks">
          <PerkCard
            v-if="
              !perkState.hasContractProvider.value &&
              gameState.lifeTimeCopperWire.value >= 0
            "
            perk-id="contract-provider"
            title="Contract with a provider"
            description="Buy commodity in bulks. (max. 10)"
            :price="30.0"
          />
        </div>
        <div class="marketing-perks"></div>
        <div class="innovation-perks"></div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped></style>
