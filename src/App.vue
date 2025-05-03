<script setup>
import { usePaperclipGame } from "./composables/usePaperclipGame.js";
import {
  gameState,
  perkState,
  selectedContinent,
  chart,
  totalAvailableBuildings,
  totalFactories,
  totalRentedBuildings,
} from "./composables/gameState.js";
import PerkCard from "./components/PerkCards.vue";
import TickHandler from "./components/TickHandler.vue";
import WorldMap from "./components/WorldMap.vue";
import GameChart from "./components/SellChart.vue";
import { defineAsyncComponent } from 'vue';
import { formatPrice, formatDate } from "./utils/helpers/format.js";

// Components that can be lazy-loaded
const RealEstate = defineAsyncComponent(() => 
  import("./components/RealEstate.vue")
);
const Stakeholding = defineAsyncComponent(() => 
  import("./components/Stakeholding.vue")
);
const StakeTrading = defineAsyncComponent(() => 
  import("./components/StakeTrading.vue")
);

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
  <!-- For static or rarely changing parts -->
  <div v-memo="[gameState.isPaused]" class="top-bar">
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
        <h3>Wire Production</h3>
        <div class="autoinfo">
          <div class="button-group">
            <button @click="buy_worker">Hire</button>
            <p>Workers: {{ gameState.workers }}</p>
          </div>
          <p>Price: ${{ formatPrice(gameState.workersPrice) }}</p>
          <p>Total: {{ gameState.workers + totalFactories * 100 }} (+{{
            totalFactories * 100
          }} in factories)</p>
        </div>
        <p class="mini_info">Makes 1m wire per worker per tick</p>
      </div>
    </transition>
    <div v-if="perkState.hasRefinery" class="card refinery">
      <h3>Copper Refinery</h3>
      <div class="refinery-info">
        <div class="button-group">
          <button @click="assignRefinery">Assign</button>
          <p>Refiners: {{ gameState.refiners || 0 }}</p>
        </div>
        <p>Ore: {{ (gameState.availableCopperOre).toFixed(3) }}</p>
        <p>Refined: {{ formatPrice(gameState.availableCopper) }} kg</p>
      </div>
      <p class="mini_info">Refines 100 ore to 1kg copper per worker</p>
    </div>
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
            v-if="perkState.hasMachinery && !perkState.hasRealEstate"
            perk-id="real-estate"
            title="Invest in Real Estate"
            description="Buy buildings for a bigger production."
            :price="1000.0"
          />
          <PerkCard
            v-if="
              perkState.hasMachinery &&
              perkState.hasRealEstate &&
              !perkState.hasRefinery
            "
            perk-id="refinery"
            title="Build a refinery"
            description="Allows a passive production of refined copper using ore."
            :price="20000.0"
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
    <div v-if="perkState.hasRealEstate" class="world-map-container">
      <WorldMap />
    </div>
    <div v-if="perkState.hasRealEstate" class="world-map-info">
      <div
        v-if="selectedContinent.name != 'No continent selected'"
        class="real-estate"
      >
        <RealEstate />
      </div>
      <div
        v-if="selectedContinent.name != 'No continent selected'"
        class="stakeholding"
      >
        <Stakeholding />
      </div>
    </div>
    <div v-if="perkState.hasRefinery" class="mining-info">
      Global ore: {{ gameState.globalCopperOre.toLocaleString() }}
    </div>
  </div>
</template>

<script></script>

<style scoped></style>
