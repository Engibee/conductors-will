import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";
import { perkState } from "./gameState";

export function buyPerk(perk) {
  if (perk === "machinery") {
    perkState.hasMachinery.value = true;
  }
  if (perk === "contract-provider") {
    perkState.hasContractProvider.value = true;
  }
}
