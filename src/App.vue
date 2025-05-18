<script setup>
import { usePaperclipGame } from "./composables/usePaperclipGame.js";
import { useGameStore } from "./stores/gameStore.js";
import {
  useContinentRealEstateStore,
  useSelectedContinentStore,
} from "./stores/realEstateStore.js";
import { useChartStore } from "./stores/chartStore.js";
import { usePerkStore } from "./stores/perkStore.js";
import PerkCard from "./components/PerkCards.vue";
import TickHandler from "./components/TickHandler.vue";
import WorldMap from "./components/WorldMap.vue";
import GameChart from "./components/SellChart.vue";
import { defineAsyncComponent, ref, watch } from "vue";
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
  assignRefinery,
  buy_refined_copper,
  buy_marketing,
  increasePrice,
  decreasePrice,
  increaseBulk,
  decreaseBulk,
} = usePaperclipGame();

const game = useGameStore();
const realEstate = useContinentRealEstateStore();
const selectedContinent = useSelectedContinentStore();
const chart = useChartStore();
const perks = usePerkStore();
const logContainer = ref(null)

watch(() => game.logs.length, () => {
  nextTick(() => {
    const el = logContainer.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
})
</script>

<template>
  <TickHandler />
  <div v-if="game.isStakeModalOpen" class="modal-overlay">
    <div class="modal-window">
      <StakeTrading />
    </div>
  </div>
  <!-- For static or rarely changing parts -->
  <div class="top-bar">
    <div class="totalCopper">
      Copper Wire made: {{ game.lifeTimeCopperWire.toLocaleString() }}m
    </div>
  </div>
  <div class="containers">
    <div class="card business">
      <h3>Stock: {{ game.copperWireinMeter }} meters</h3>
      <button @click="makeCopperWire">Make Copper Wire</button>

      <h5>Business</h5>
      <p>💵Funds: ${{ formatPrice(game.funds).toLocaleString() }}</p>
      <p class="sellprice">
        <button @click="decreasePrice" class="small-btn">-</button>
        <button @click="increasePrice" class="small-btn">+</button>
        Selling price: ${{ formatPrice(game.priceOfCopper) }}
      </p>
      <p>
        Demand: <strong>{{ formatPrice(currentDemand) }}</strong>
      </p>
      <p>Refined Copper: {{ formatPrice(game.availableCopper) }} kg</p>
      <div class="commodity">
        <button
          v-if="perks.hasContractProvider"
          @click="decreaseBulk"
          class="bulk-button"
        >
          -
        </button>
        <button class="bulk-button" @click="buy_refined_copper">
          Buy Ref. Copper x {{ game.copperBulkAmount }}
        </button>
        <button
          v-if="perks.hasContractProvider"
          @click="increaseBulk"
          class="bulk-button"
        >
          +
        </button>
      </div>
      <p class="mini_info">
        Price: ${{ formatPrice(game.kgOfCopper * game.copperBulkAmount) }}
      </p>
    </div>
    <transition name="fade-slide">
      <div v-if="perks.hasMachinery" class="card automation">
        <h3>Wire Production</h3>
        <div class="autoinfo">
          <div class="button-group">
            <button @click="buy_worker">Assign</button>
            <p>Workers: {{ game.wirers }}</p>
          </div>
          <p>Price: ${{ formatPrice(game.workersPrice) }}</p>
          <p>
            Total: {{ game.wirers + realEstate.totalFactories * 50 }} (+{{
              realEstate.totalFactories * 50
            }}
            in factories)
          </p>
        </div>
        <p class="mini_info">Makes 1m wire per worker per tick</p>
      </div>
    </transition>
    <div v-if="perks.hasRefinery" class="card refinery">
      <h3>Copper Refinery</h3>
      <div class="refinery-info">
        <div class="button-group">
          <button @click="assignRefinery">Assign</button>
          <p>
            Refiners: {{ game.refiners || 0 }} (+
            {{ realEstate.totalFactories }} in factories)
          </p>
        </div>
        <p>Ore: {{ game.availableCopperOre.toFixed(3) }}</p>
        <p>Refined: {{ formatPrice(game.availableCopper) }} kg</p>
      </div>
      <p class="mini_info">Refines 100 ore to 1kg copper per worker</p>
    </div>
    <div ref="logContainer" class="card terminal">
      <div class="time">
        📅 Week: {{ game.week }} | 📆 Month: {{ formatDate(game.month) }} | 📅
        Year:
        {{ game.year }}
      </div>
      <div v-for="(msg, index) in game.logs" :key="index" class="log-message">
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
        'lab-moved': perks.hasMachinery,
      }"
    >
      <h4 class="labtitle">Lab Research</h4>
      <div class="marketing-container">
        <div class="marketing-bar">
          <div
            class="marketing-fill"
            :style="{ height: game.marketing + '%' }"
          ></div>
        </div>
        <div class="marketing-info">
          <p>Marketing: {{ game.marketing }}%</p>
          <button @click="buy_marketing">Buy</button>
          <p>
            {{
              game.marketing >= 100
                ? "The entire world knows about the conductor's will!!!"
                : `Price: $${formatPrice(game.marketingPrice)}`
            }}
          </p>
        </div>
      </div>
      <div class="perks-container">
        <div class="industrial-perks">
          <PerkCard
            v-if="!perks.hasMachinery && game.lifeTimeCopperWire >= 0"
            perk-id="machinery"
            title="Garage Factory"
            description="Automatize the production of copper wire."
            :price="100.0"
          />
          <PerkCard
            v-if="perks.hasMachinery && !perks.hasRealEstate"
            perk-id="real-estate"
            title="Invest in Real Estate"
            description="Buy buildings for a bigger production."
            :price="1000.0"
          />
          <PerkCard
            v-if="
              perks.hasMachinery && perks.hasRealEstate && !perks.hasRefinery
            "
            perk-id="refinery"
            title="Build a refinery"
            description="Allows ore refining."
            :price="20000.0"
          />
        </div>
        <div class="commodity-perks">
          <PerkCard
            v-if="!perks.hasContractProvider && game.lifeTimeCopperWire >= 0"
            perk-id="contract-provider"
            title="Contract with a provider"
            description="Buy commodity in bulks. (max. 10)"
            :price="30.0"
          />
        </div>
        <div class="marketing-perks">
          <PerkCard
            v-if="!perks.hasPatentLogo && game.lifeTimeCopperWire >= 0"
            perk-id="patent-logo"
            title="Patent your logo"
            description="Secure your brand identity and increase your market value."
            :price="150.0"
          />
        </div>
        <div class="innovation-perks"></div>
      </div>
    </div>
    <div v-if="perks.hasRealEstate" class="world-map-container">
      <WorldMap />
    </div>
    <div v-if="perks.hasRealEstate" class="world-map-info">
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
    <div v-if="perks.hasRefinery" class="mining-info">
      Global ore: {{ game.globalCopperOre.toLocaleString() }}
    </div>
  </div>
</template>

<script></script>

<style scoped></style>
