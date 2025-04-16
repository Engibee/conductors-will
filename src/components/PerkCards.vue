<template>
  <div class="perk-box">
    <p>
      <strong>{{ title }}</strong
      ><br />{{ description }}
    </p>
    <p>Price: ${{ price }}</p>
    <button @click="buy()">Buy</button>
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
  margin: 10px 0;
}
</style>
