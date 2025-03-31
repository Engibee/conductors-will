import { ref, onMounted, onUnmounted } from 'vue'


export function usePaperclipGame(){

onMounted(() => {
    intervalo = setInterval(update_tick, 1000)
    console.log(`O contador foi montado.`)
    })
onUnmounted(() => {
    // Limpa o intervalo quando o componente for destruído
    clearInterval(intervalo)
    console.log(`O contador foi limpado/destruído.`)
    })
const ticks = ref(0)
let intervalo = null
const copperWireinMeter = ref(0)
const availableCopper = ref(10)
const copperQtPerMeter = 0.02232
const funds = ref(30)
const priceOfCopper = ref(0.50)
const kgOfCopper = 9.795
const workers = ref(0)
const workersPrice = ref(150.0)
const week = ref(0)
const month = ref(0)
const year = ref(0)

const update_tick = () => {
    ticks.value++
    // Ação a cada 1 tick
  if (ticks_events(5)) {
    buy_simulation_per_tick()
  }
  if (ticks_events(10)){
    time_handler()
  }
  if (ticks_events(1)){
    automation_handler()
  }
}
function automation_handler(){
  if (availableCopper.value >= (copperQtPerMeter * workers.value)){
  copperWireinMeter.value += 1 * workers.value
  availableCopper.value -= (1 * workers.value) * copperQtPerMeter
  }
  else{
    //Nothing yet.
  }
}
function buy_refined_copper(){
  if (funds.value >= kgOfCopper){
    availableCopper.value += 1.0
    funds.value -= kgOfCopper
  }
}
function buy_worker(){
  if (funds.value >= workersPrice.value){
    funds.value -= workersPrice.value
    workers.value++
  }
}
function time_handler(){
  if (month.value == 12 && week.value == 4){
    year.value++
    month.value = 0
    week.value = 0
  }
  else if (week.value == 4){
    month.value++
    week.value = 0
  }
  else{
    week.value++
  }
}
function ticks_events(tick){
  return ticks.value % tick === 0
}

function buy_chance(price){
  return 0.8 * Math.exp(-((price - 0.50) / 0.20))
}

function buy_simulation_per_tick(){
  const chance = buy_chance(priceOfCopper.value);
  if (Math.random() < chance) {
    const quantity = Math.floor(Math.random() * 10) + 1;
    if (copperWireinMeter.value >= quantity){
    copperWireinMeter.value -= quantity;
    funds.value += quantity * priceOfCopper.value
    }
  }
}

function FabricarPaperclip(){
    if (availableCopper.value >= copperQtPerMeter){
        availableCopper.value -= copperQtPerMeter
        copperWireinMeter.value++
    }
}
function increasePrice(){
    priceOfCopper.value += 0.10
}
function decreasePrice(){
  if (priceOfCopper.value > 1e-6){
    priceOfCopper.value -= 0.10
  }
}
return{
    copperWireinMeter,
    availableCopper,
    funds,
    priceOfCopper,
    workers,
    week,
    month,
    year,
    FabricarPaperclip,
    buy_worker,
    buy_refined_copper,
    buy_chance,
    increasePrice,
    decreasePrice
}

}
