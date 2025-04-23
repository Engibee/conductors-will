import { gameState, stakeHoldingTrading } from "../../composables/gameState.js";

export function canAfford(price) {
  return gameState.funds >= price;
}

export function spend(price) {
  if (canAfford(price)) {
    gameState.funds -= price;
    return true;
  } else {
    return false;
  }
}

export function resetStakeOffers() {
  stakeHoldingTrading.fundsOffer = 0;
  stakeHoldingTrading.copperWireinMeterOffer = 0;
  stakeHoldingTrading.rentedBuildingOffer = 0;
  stakeHoldingTrading.factoriesOffer = 0;
}