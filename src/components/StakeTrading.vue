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
  const org = stakeHoldingTradingStore.selectedOrganization.replace(" ", "");
  const orgData = stakeHoldingTradingStore[org];

  // Limitar pelo máximo que o jogador tem
  if (stakeHoldingTradingStore[offerKey] > max) {
    stakeHoldingTradingStore[offerKey] = max;
  } else if (stakeHoldingTradingStore[offerKey] < 0) {
    stakeHoldingTradingStore[offerKey] = 0;
  }

  let offerStake = calculateStakeOffer();

  if (offerStake > orgData.stake) {
    let safeValue = stakeHoldingTradingStore[offerKey];
    while (offerStake > orgData.stake && safeValue > 0) {
      safeValue--;
      stakeHoldingTradingStore[offerKey] = safeValue;
      offerStake = calculateStakeOffer();
    }
  }
}

function reduceOfferToMaxStake() {
  const org = stakeHoldingTradingStore.selectedOrganization.replace(" ", "");
  const orgData = stakeHoldingTradingStore[org];
  const weights = orgData.valuationWeight;
  const availableStake = orgData.stake;

  // Cálculo total da oferta atual
  const offerScore =
    stakeHoldingTradingStore.fundsOffer * resourcesStore.funds * weights.funds +
    stakeHoldingTradingStore.copperWireinMeterOffer * resourcesStore.copperWireinMeter * weights.copper +
    stakeHoldingTradingStore.rentedBuildingOffer * resourcesStore.rentedBuilding * weights.residential +
    stakeHoldingTradingStore.factoriesOffer * resourcesStore.factories * weights.factories;

  const availabilityFactor = 1 - orgData.stake / 100;
  const rawStake = (offerScore * availabilityFactor) / 1000000;

  // Se a oferta ultrapassa o stake disponível, ajusta proporcionalmente todos os recursos
  if (rawStake > availableStake) {
    const reductionRatio = availableStake / rawStake;

    stakeHoldingTradingStore.fundsOffer = Math.floor(stakeHoldingTradingStore.fundsOffer * reductionRatio);
    stakeHoldingTradingStore.copperWireinMeterOffer = Math.floor(stakeHoldingTradingStore.copperWireinMeterOffer * reductionRatio);
    stakeHoldingTradingStore.rentedBuildingOffer = Math.floor(stakeHoldingTradingStore.rentedBuildingOffer * reductionRatio);
    stakeHoldingTradingStore.factoriesOffer = Math.floor(stakeHoldingTradingStore.factoriesOffer * reductionRatio);
  }
}

function normalizeStakeDistribution() {
  const total =
    stakeHoldingTradingStore.You +
    stakeHoldingTradingStore.Governments.stake +
    stakeHoldingTradingStore.TechCorporations.stake +
    stakeHoldingTradingStore.FinancialFunds.stake +
    stakeHoldingTradingStore.NGOs.stake;

  const error = total - 100;

  if (Math.abs(error) > 0.001) {
    // Subtrai/redistribui erro para a organização com maior stake
    let maxOrg = "Government";
    let maxValue = stakeHoldingTradingStore.Governments.stake;

    for (const orgName of ["TechCorporations", "FinancialFunds", "NGOs"]) {
      if (stakeHoldingTradingStore[orgName].stake > maxValue) {
        maxValue = stakeHoldingTradingStore[orgName].stake;
        maxOrg = orgName;
      }
    }

    stakeHoldingTradingStore[maxOrg].stake -= error;
  }
}

const tabClose = () => {
  game.isPaused = false;
  game.isStakeModalOpen = false;
  game.selectedOrganization = null;
  resetStakeOffers();
};

const confirmStake = () => {
  reduceOfferToMaxStake(); // Reduz a oferta se ela exceder o stake da organização

  const org = stakeHoldingTradingStore.selectedOrganization.replace(" ", "");
  const orgData = stakeHoldingTradingStore[org];
  const offerScore = calculateStakeOffer();

  const maxStakeReceivable = Math.min(offerScore, 100 - stakeHoldingTradingStore.You);

  stakeHoldingTradingStore.You += maxStakeReceivable;
  orgData.stake = Math.max(0, orgData.stake - maxStakeReceivable);

  const usedRatio = maxStakeReceivable / offerScore;

  game.funds -= Math.floor(stakeHoldingTradingStore.fundsOffer * usedRatio);
  game.copperWireinMeter -= Math.floor(stakeHoldingTradingStore.copperWireinMeterOffer * usedRatio);
  continentRealEstateStore[selectedContinentStore.name].rentedBuildings -= Math.floor(stakeHoldingTradingStore.rentedBuildingOffer * usedRatio);
  continentRealEstateStore[selectedContinentStore.name].factories -= Math.floor(stakeHoldingTradingStore.factoriesOffer * usedRatio);

  normalizeStakeDistribution();

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
  padding: 3.40vh 1.56vw;
  border-radius: 2%;
  width: 31.25vw;
  color: white;
  text-align: center;
}

.action {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 1%;
  margin-top: 2.72vh;
}
</style>
