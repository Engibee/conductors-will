<script setup>
import { usePaperclipGame } from "./composables/usePaperclipGame.js";
import {
  gameState,
  perkState,
  selectedContinent,
  chart,
} from "./composables/gameState.js";
import PerkCard from "./components/PerkCards.vue";
import TickHandler from "./components/TickHandler.vue";
import WorldMap from "./components/WorldMap.vue";
import GameChart from "./components/SellChart.vue";
import RealEstate from "./components/RealEstate.vue";
import Stakeholding from "./components/Stakeholding.vue";
import StakeTrading from "./components/StakeTrading.vue";
import { formatPrice, formatDate } from "./utils/helpers/format.js";
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
 <div v-if="gameState.isStakeModalOpen" class="modal-overlay">
  <div class="modal-window">
    <StakeTrading />
  </div>
</div>
  <div class="top-bar">
    <div class="totalCopper">
      Copper Wire made: {{ gameState.lifeTimeCopperWire.toLocaleString() }}m
    </div>
  </div>
  <div class="containers">
    <div class="card business">
      <h3>Stock: {{ gameState.copperWireinMeter }} meters</h3>
      <button @click="makeCopperWire">Make Copper Wire</button>

      <h5>Business</h5>
      <p>💵Funds: ${{ formatPrice(gameState.funds).toLocaleString() }}</p>
      <p class="sellprice">
        <button @click="decreasePrice" class="small-btn">-</button>
        <button @click="increasePrice" class="small-btn">+</button>
        Selling price: ${{ formatPrice(gameState.priceOfCopper) }}
      </p>
      <p>
        Demand: <strong>{{ formatPrice(currentDemand) }}</strong>
      </p>
      <p>Refined Copper: {{ formatPrice(gameState.availableCopper) }} kg</p>
      <div class="commodity">
        <button
          v-if="perkState.hasContractProvider"
          @click="decreaseBulk"
          class="bulk-button"
        >
          -
        </button>
        <button @click="buy_refined_copper">
          Buy Ref. Copper x {{ gameState.copperBulkAmount }}
        </button>
        <button
          v-if="perkState.hasContractProvider"
          @click="increaseBulk"
          class="bulk-button"
        >
          +
        </button>
      </div>
      <p class="mini_info">
        Price: ${{
          formatPrice(gameState.kgOfCopper * gameState.copperBulkAmount)
        }}
      </p>
    </div>
    <transition name="fade-slide">
      <div v-if="perkState.hasMachinery" class="card automation">
        <h3>Automation</h3>
        <div class="autoinfo">
          <button @click="buy_worker">Buy worker</button>
          <p>Price: ${{ formatPrice(gameState.workersPrice) }}</p>
          <p>Amount of workers: {{ (gameState.workers + (gameState.factories * 100)) }}  (+{{ (gameState.factories * 100) }})</p>
        </div>
        <p class="mini_info">Generates 1 meter of copper per tick(second)</p>
      </div>
    </transition>
    <div class="card terminal">
      <div class="time">
        📅 Week: {{ gameState.week }} | 📆 Month:
        {{ formatDate(gameState.month) }} | 📅 Year:
        {{ gameState.year }}
      </div>
      <div
        v-for="(msg, index) in gameState.logs"
        :key="index"
        class="log-message"
      >
        {{ msg }}
      </div>
    </div>
    <div class="card sellchart">
      <GameChart :labels="chart.chartLabel" :data="chart.chartData" />
    </div>
    <div
      :class="{
        card: true,
        lab: true,
        'lab-moved': perkState.hasMachinery,
      }"
    >
      <h4 class="labtitle">Lab Research</h4>
      <div class="marketing-container">
        <div class="marketing-bar">
          <div
            class="marketing-fill"
            :style="{ height: gameState.marketing + '%' }"
          ></div>
        </div>
        <div class="marketing-info">
          <p>Marketing: {{ gameState.marketing }}%</p>
          <button @click="buy_marketing">Buy</button>
          <p>Price: ${{ formatPrice(gameState.marketingPrice) }}</p>
        </div>
      </div>
      <div class="perks-container">
        <div class="industrial-perks">
          <PerkCard
            v-if="!perkState.hasMachinery && gameState.lifeTimeCopperWire >= 0"
            perk-id="machinery"
            title="Garage Factory"
            description="Automatize the production of copper wire."
            :price="100.0"
          />
          <PerkCard
            v-if="perkState.hasMachinery && !perkState.hasRealState && gameState.lifeTimeCopperWire >= 0"
            perk-id="real-estate"
            title="Invest in Real State"
            description="Buy buildings for a bigger production."
            :price="1000.0"
          />
        </div>
        <div class="commodity-perks">
          <PerkCard
            v-if="
              !perkState.hasContractProvider &&
              gameState.lifeTimeCopperWire >= 0
            "
            perk-id="contract-provider"
            title="Contract with a provider"
            description="Buy commodity in bulks. (max. 10)"
            :price="30.0"
          />
        </div>
        <div class="marketing-perks">
          <PerkCard
            v-if="!perkState.hasPatentLogo && gameState.lifeTimeCopperWire >= 0"
            perk-id="patent-logo"
            title="Patent your logo"
            description="Secure your brand identity and increase your market value."
            :price="150.0"
          />
        </div>
        <div class="innovation-perks"></div>
      </div>
    </div>
    <div v-if="perkState.hasRealState" class="world-map-container">
      <WorldMap />
    </div>
    <div v-if="perkState.hasRealState" class="world-map-info">
      <div v-if="selectedContinent.name!='No continent selected'" class="real-estate">
        <RealEstate />
      </div>
      <div v-if="selectedContinent.name!='No continent selected'" class="stakeholding">
        <Stakeholding />
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped></style>
