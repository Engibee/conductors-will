import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";
import { perkState } from "./gameState";

export function buyPerk(perk) {
  if (perk === "machinery") {
    perkState.hasMachinery = true;
  }
  if (perk === "contract-provider") {
    perkState.hasContractProvider = true;
  }
  if (perk === "real-state") {
    perkState.hasRealState = true;
  }
}
