import { ref } from 'vue'

export function usePaperclipGame(){

const paperclips = ref(0)
const fioDisponivel = ref(100)
const QtdDeFioPorClipe = 0.036

function FabricarPaperclip(){
    console.log('Antes de fabricar: ', paperclips.value, fioDisponivel.value)
    if (fioDisponivel.value >= QtdDeFioPorClipe){
        fioDisponivel.value -= QtdDeFioPorClipe
        paperclips.value++
    }
    console.log('Depois de fabricar: ', paperclips.value, fioDisponivel.value)
}
return{
    paperclips,
    fioDisponivel,
    FabricarPaperclip
}

}
