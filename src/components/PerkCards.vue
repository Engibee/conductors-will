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
import { usePaperclipGame } from '../composables/usePaperclipGame.js'
import { buyPerk } from "../composables/Perks.js";

const { funds } = usePaperclipGame()

const props = defineProps({
  perkId: String,
  title: String,
  description: String,
  price: Number,
});

function buy() {
  console.log(funds.value,props.price);
  if (funds.value >= props.price) {
    funds.value -= props.price; 
    buyPerk(props.perkId);
  } else {
    alert("Not enough funds to buy this perk.");
  }
}
</script>

<style scoped>
.perk-box {
  margin: 10px 0;
}
</style>
