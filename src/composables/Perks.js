import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";
import { gameState } from "./gameState";
import { perkState } from "./gameState";

export function buyPerk(perk) {
  if (perk === "machinery") {
    perkState.hasMachinery = true;
  }
  if (perk === "contract-provider") {
    perkState.hasContractProvider = true;
  }
  if (perk === "real-estate") {
    perkState.hasRealEstate = true;
  }
  if (perk === "patent-logo") {
    perkState.hasPatentLogo = true;
    gameState.maxSaleModifier += 0.1;
  }
  if (perk === "refinery") {
    perkState.hasRefinery = true;
  }
}
