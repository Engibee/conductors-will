import { useGameStore } from "../../stores/gameStore.js";
import { useStakeHoldingTradingStore } from "../../stores/stakeTrading.js";

export function canAfford(price) {
  const game = useGameStore();
  return game.funds >= price;
}

export function spend(price) {
  const game = useGameStore();
  if (canAfford(price)) {
    game.funds -= price;
    return true;
  } else {
    return false;
  }
}

export function resetStakeOffers() {
  const stakeHoldingTrading = useStakeHoldingTradingStore();

  stakeHoldingTrading.fundsOffer = 0;
  stakeHoldingTrading.copperWireinMeterOffer = 0;
  stakeHoldingTrading.rentedBuildingOffer = 0;
  stakeHoldingTrading.factoriesOffer = 0;
}