<template>
  <div
    v-if="
      continentRealEstate[selectedContinent.name].license &&
      selectedContinent.name != 'No continent selected'
    "
  >
    <p class="real-state-info">
      🏭Factories: {{ continentRealEstate[selectedContinent.name].factories }}
      <button @click="increaseFactory" class="real-state-info-btn">
        Factorize
      </button>
    </p>
    <p class="real-state-info">
      🏚️Available Buildings:
      {{ continentRealEstate[selectedContinent.name].availableBuildings }}
      <button @click="buyRealEstate" class="real-state-info-btn">
        Buy: $10,000
      </button>
    </p>
    <p class="real-state-info">
      🏘️Rented Buildings:
      {{ continentRealEstate[selectedContinent.name].rentedBuildings }}
      <button @click="increaseRentedBulding" class="real-state-info-btn">
        Rent
      </button>
    </p>
  </div>

  <div class="license-container" v-else>
    <button class="buy-license-btn" @click="buyLicense">
      Unlock real estate in {{ selectedContinent.name }} – $50,000
    </button>
  </div>
</template>

<script setup>
import {
  gameState,
  continentRealEstate,
  selectedContinent,
} from "../composables/gameState.js";
import { spend } from "../utils/helpers/transactionHandle.js";

function buyLicense() {
  if (spend(50000)) {
    continentRealEstate[selectedContinent.name].license = true;
  } else {
    alert("Not enough funds to buy this license.");
  }
}

function buyRealEstate() {
  if (spend(10000)) {
    continentRealEstate[selectedContinent.name].availableBuildings += 1;
  } else {
    alert("Not enough funds to buy this real estate.");
  }
}

function increaseFactory() {
  if (continentRealEstate[selectedContinent.name].availableBuildings > 0) {
    continentRealEstate[selectedContinent.name].factories += 1;
    gameState.factories += 1;
    continentRealEstate[selectedContinent.name].availableBuildings -= 1;
  } else {
    alert("Not enough buildings to build a factory.");
  }
}

function increaseRentedBulding() {
  if (continentRealEstate[selectedContinent.name].availableBuildings > 0) {
    continentRealEstate[selectedContinent.name].rentedBuildings += 1;
    gameState.rentedBuilding += 1;
    continentRealEstate[selectedContinent.name].availableBuildings -= 1;
  } else {
    alert("Not enough buildings to rent.");
  }
}
</script>

<style scoped>
.real-state-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.8rem;
  margin: 3px 0;
  padding: 0px;
}

.real-state-info-btn {
  padding: 0px;
  font-size: 0.7rem;
  line-height: 1;
  border-radius: 0px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}

.buy-license-btn {
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
</style>
