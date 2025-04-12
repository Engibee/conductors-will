import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";

export const hasMachinery = ref(false);

export function buyPerk(perk) {
  if (perk === "machinery") {
    hasMachinery.value = true;
  }
}
