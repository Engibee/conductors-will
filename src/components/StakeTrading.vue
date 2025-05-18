<template>
  <div v-if="game.isStakeModalOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="offerTable">
        <div class="funds">
          <p>
            Funds:
            <input
              type="number"
              v-model.number="stakeHoldingTradingStore.fundsOffer"
              :max="game.funds"
              min="0"
              @change="validateOffer('funds')"
            />
            max: ${{ game.funds.toLocaleString() }}
          </p>
        </div>
        <div class="copperWire">
          <p>
            Copper Wire:
            <input
              type="number"
              v-model.number="stakeHoldingTradingStore.copperWireinMeterOffer"
              :max="game.copperWireinMeter"
              min="0"
              @change="validateOffer('copperWireinMeter')"
            />
            max: {{ game.copperWireinMeter.toLocaleString() }}m
          </p>
        </div>
        <div class="residential">
          <p>
            Residential:
            <input
              type="number"
              v-model.number="stakeHoldingTradingStore.rentedBuildingOffer"
              :max="continentRealEstateStore[selectedContinentStore.name].rentedBuildings"
              min="0"
              @change="validateOffer('residential')"
            />
            max: {{ continentRealEstateStore[selectedContinentStore.name].rentedBuildings }}
          </p>
        </div>
        <div class="factory">
          <p>
            Factories:
            <input
              type="number"
              v-model.number="stakeHoldingTradingStore.factoriesOffer"
              :max="continentRealEstateStore[selectedContinentStore.name].factories"
              min="0"
              @change="validateOffer('factories')"
            />
            max: {{ continentRealEstateStore[selectedContinentStore.name].factories }}
          </p>
        </div>
      </div>
      <div class="answer">
        <p>You're dealing with:</p>
        <h2>{{ stakeHoldingTradingStore.selectedOrganization }}</h2>
        <p>
          Their stake:
          {{
            stakeHoldingTradingStore[
              stakeHoldingTradingStore.selectedOrganization.replace(" ", "")
            ].stake
          }}% -({{ calculateStakeOffer() }}%)
        </p>
        <p>
          Your stake: {{ stakeHoldingTradingStore.You }}% +({{
            calculateStakeOffer()
          }}%)
        </p>
      </div>
      <div class="action">
        <button @click="confirmStake">Confirm</button
        ><button @click="cancelStake">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { resetStakeOffers } from "../utils/helpers/transactionHandle";
import { useStakeHoldingTradingStore, useResourcesStore } from "../stores/stakeTrading";
import { useContinentRealEstateStore, useSelectedContinentStore } from "../stores/realEstateStore";
import { useGameStore } from "../stores/gameStore";

const game = useGameStore();
const stakeHoldingTradingStore = useStakeHoldingTradingStore();
const resourcesStore = useResourcesStore();
const continentRealEstateStore = useContinentRealEstateStore();
const selectedContinentStore = useSelectedContinentStore();

function calculateStakeOffer() {
  const org = stakeHoldingTradingStore.selectedOrganization.replace(" ", "");
  const orgData = stakeHoldingTradingStore[org];
  if (!orgData || !orgData.valuationWeight) return 0;

  const weights = orgData.valuationWeight;

  const offerScore =
    stakeHoldingTradingStore.fundsOffer * resourcesStore.funds * weights.funds +
    stakeHoldingTradingStore.copperWireinMeterOffer *
      resourcesStore.copperWireinMeter *
      weights.copper +
    stakeHoldingTradingStore.rentedBuildingOffer *
      resourcesStore.rentedBuilding *
      weights.residential +
    stakeHoldingTradingStore.factoriesOffer *
      resourcesStore.factories *
      weights.factories;

  const stakeAlreadyOwned = orgData.stake;
  const availabilityFactor = 1 - stakeAlreadyOwned / 100;

  const rawStake = (offerScore * availabilityFactor) / 1000000;

  return parseFloat(rawStake.toFixed(4));
}

function validateOffer(commodity) {
  const offerKey = `${commodity}Offer`;
  const max = game[commodity];

  if (stakeHoldingTradingStore[offerKey] > max) {
    stakeHoldingTradingStore[offerKey] = max;
  } else if (stakeHoldingTradingStore[offerKey] < 0) {
    stakeHoldingTradingStore[offerKey] = 0;
  }
}

const tabClose = () => {
  game.isPaused = false;
  game.isStakeModalOpen = false;
  game.selectedOrganization = null;
  resetStakeOffers();
};

const confirmStake = () => {
  const org = stakeHoldingTradingStore.selectedOrganization.replace(" ", "");
  const orgData = stakeHoldingTradingStore[org];
  const offerScore = calculateStakeOffer();

  stakeHoldingTradingStore.You += offerScore;
  orgData.stake -= offerScore;

  game.funds -= stakeHoldingTradingStore.fundsOffer;
  game.copperWireinMeter -= stakeHoldingTradingStore.copperWireinMeterOffer;
  continentRealEstateStore[selectedContinentStore.name].rentedBuildings -= stakeHoldingTradingStore.rentedBuildingOffer;
  continentRealEstateStore[selectedContinentStore.name].factories -= stakeHoldingTradingStore.factoriesOffer;

  tabClose();
};

const cancelStake = () => {
  tabClose();
};
</script>

<style scoped>
.offerTable {
  flex-grow: 1;
  display: block;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  width: 100%;
  height: 100%;
}

.answer {
  flex-grow: 1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* escurece o fundo */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  display: flex;
  flex-wrap: wrap;
  background-color: #213547;
  padding: 20px;
  border-radius: 2%;
  width: 400px;
  color: white;
  text-align: center;
}

.action {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}
</style>
