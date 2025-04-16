import { gameState } from "../../composables/gameState.js";

export function canAfford(price) {
  return gameState.funds.value >= price;
}

export function spend(price) {
  if (canAfford(price)) {
    gameState.funds.value -= price;
    return true;
  } else {
    return false;
  }
}
