import { useGameStore } from "../stores/gameStore.js";
import { usePerkStore } from "../stores/perkStore.js";

export function buyPerk(perk) {
  const game = useGameStore();
  const perks = usePerkStore();

  if (perk === "machinery") {
    perks.hasMachinery = true;
  }
  if (perk === "contract-provider") {
    perks.hasContractProvider = true;
  }
  if (perk === "real-estate") {
    perks.hasRealEstate = true;
  }
  if (perk === "patent-logo") {
    perks.hasPatentLogo = true;
    game.maxSaleModifier += 0.1;
  }
  if (perk === "refinery") {
    perks.hasRefinery = true;
  }
}
