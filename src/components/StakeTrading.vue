<template>
  <div v-if="gameState.isStakeModalOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="offerTable">
        <div class="funds">
          <p>
            Funds:
            <input
              type="number"
              v-model.number="stakeHoldingTrading.fundsOffer"
              :max="gameState.funds"
              min="0"
              @change="validateOffer('funds')"
            />
            max: ${{ (gameState.funds).toLocaleString() }}
          </p>
        </div>
        <div class="copperWire">
          <p>
            Copper Wire:
            <input
              type="number"
              v-model.number="stakeHoldingTrading.copperWireinMeterOffer"
              :max="gameState.copperWireinMeter"
              min="0"
              @change="validateOffer('copperWireinMeter')"
            />
            max: {{ (gameState.copperWireinMeter).toLocaleString() }}m
          </p>
        </div>
        <div class="residential">
          <p>
            Residential:
            <input
              type="number"
              v-model.number="stakeHoldingTrading.rentedBuildingOffer"
              :max="gameState.rentedBuilding"
              min="0"
              @change="validateOffer('residential')"
            />
            max: {{ gameState.rentedBuilding }}
          </p>
        </div>
        <div class="factory">
          <p>
            Factories:
            <input
              type="number"
              v-model.number="stakeHoldingTrading.factoriesOffer"
              :max="gameState.factories"
              min="0"
              @change="validateOffer('factories')"
            />
            max: {{ gameState.factories }}
          </p>
        </div>
      </div>
      <div class="answer">
        <p>You're dealing with:</p>
        <h2>{{ stakeHoldingTrading.selectedOrganization }}</h2>
        <p>
          Their stake:
          {{
            stakeHoldingTrading[
              stakeHoldingTrading.selectedOrganization.replace(" ", "")
            ].stake
          }}%
        </p>
        <p>Your stake: {{ stakeHoldingTrading.You }}%</p>
      </div>
      <div class="action">
        <button @click="confirmStake">Confirm</button
        ><button @click="cancelStake">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { gameState, stakeHoldingTrading } from "../composables/gameState";

function validateOffer(commodity) {
  const offerKey = `${commodity}Offer`;
  const max = gameState[commodity];

  if (stakeHoldingTrading[offerKey] > max) {
    stakeHoldingTrading[offerKey] = max;
  } else if (stakeHoldingTrading[offerKey] < 0) {
    stakeHoldingTrading[offerKey] = 0;
  }
}

const tabClose = () => {
  gameState.isPaused = false;
  gameState.isStakeModalOpen = false;
  gameState.selectedOrganization = null;
};

const confirmStake = () => {
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
  border-radius: 12px;
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
