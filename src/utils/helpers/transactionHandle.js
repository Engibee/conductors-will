import { gameState } from "../../composables/gameState.js";

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
