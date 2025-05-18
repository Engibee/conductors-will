<template>
  <div
    v-if="
      realEstate[selectedContinent.name].license &&
      selectedContinent.name != 'No continent selected'
    "
  >
    <p class="real-estate-info">
      🏭Factories: {{ realEstate[selectedContinent.name].factories }}
      <button @click="increaseFactory" class="real-estate-info-btn">
        Factorize
      </button>
    </p>
    <p class="real-estate-info">
      🏚️Available Buildings:
      {{ realEstate[selectedContinent.name].availableBuildings }}
      <button @click="buyRealEstate" class="real-estate-info-btn">
        Buy: $10,000
      </button>
    </p>
    <p class="real-estate-info">
      🏘️Rented Buildings:
      {{ realEstate[selectedContinent.name].rentedBuildings }}
      <button @click="increaseRentedBulding" class="real-estate-info-btn">
        Rent
      </button>
    </p>
  </div>

  <div class="license-container" v-else>
    <button
      class="buy-license-btn"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @click="buyLicense"
      :style="{ backgroundColor: hover ? '#405466' : 'transparent'}"
    >
      Unlock real estate in {{ selectedContinent.name }} – $50,000
    </button>
  </div>
</template>

<script setup>
import {
  useContinentRealEstateStore,
  useSelectedContinentStore,
} from "../stores/realEstateStore.js";
import { spend } from "../utils/helpers/transactionHandle.js";
import { ref } from 'vue';

const hover = ref(false);

const realEstate = useContinentRealEstateStore();
const selectedContinent = useSelectedContinentStore();

function buyLicense() {
  if (spend(50000)) {
    realEstate[selectedContinent.name].license = true;
  } else {
    alert("Not enough funds to buy this license.");
  }
  hover.value = false;
}

function buyRealEstate() {
  if (spend(10000)) {
    realEstate[selectedContinent.name].availableBuildings += 1;
  } else {
    alert("Not enough funds to buy this real estate.");
  }
}

function increaseFactory() {
  if (realEstate[selectedContinent.name].availableBuildings > 0) {
    realEstate[selectedContinent.name].factories += 1;
    realEstate[selectedContinent.name].availableBuildings -= 1;
  } else {
    alert("Not enough buildings to build a factory.");
  }
}

function increaseRentedBulding() {
  if (realEstate[selectedContinent.name].availableBuildings > 0) {
    realEstate[selectedContinent.name].rentedBuildings += 1;
    realEstate[selectedContinent.name].availableBuildings -= 1;
  } else {
    alert("Not enough buildings to rent.");
  }
}
</script>

<style scoped>
.real-estate-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: 0.8rem;
  margin: 0.2vh 0;
}

.real-estate-info-btn {
  padding: 0.1vh 1vw;
  font-size: 1.1rem;
  line-height: 1;
  width: 12vw;
  border-radius: 0px;
  color: black;
  background-color: white;
  cursor: pointer;
}

.buy-license-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  color: white;
  background-color: transparent;
  padding: 1rem;
  border-radius: 2%;
  cursor: pointer;
}
</style>
