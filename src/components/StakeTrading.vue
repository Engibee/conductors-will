<template>
  <div v-if="gameState.isStakeModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>Negociação de Stake</h2>
      <p>Você quer comprar 5% de stake na África por $2.000.000?</p>
      <button @click="confirmStake">Confirmar</button>
      <button @click="closeModal">Cancelar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { gameState } from '../composables/gameState';

const openModal = () => {
  gameState.isPaused = false;
  gameState.isStakeModalOpen = false;
};

const closeModal = () => {
  gameState.isPaused = false;
  gameState.isStakeModalOpen = false;
};

const confirmStake = () => {
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* escurece o fundo */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: #213547;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  color: white;
  text-align: center;
}
</style>