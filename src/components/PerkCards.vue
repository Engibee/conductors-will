<template>
  <div class="perk-box">
    <p style="font-size: 0.8vw; margin-bottom: 0.3vh;">
      <strong>{{ title }}</strong
      ><br />{{ description }}
    </p>
    <p style="margin-bottom: 0.3vh;">Price: ${{ price }}</p>
    <button @click="buy" style="font-size: 0.8vw;">Buy</button>
  </div>
</template>

<script setup>
import { buyPerk } from "../composables/Perks.js";
import { spend } from "../utils/helpers/transactionHandle.js"

const props = defineProps({
  perkId: String,
  title: String,
  description: String,
  price: Number,
});

function buy() {
  spend(props.price) ? buyPerk(props.perkId) : alert("Not enough funds to buy this perk.");
}
</script>

<style scoped>
.perk-box {
  display:block;
  font-size: 0.5vw;
}
</style>
