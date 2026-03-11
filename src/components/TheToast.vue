<script setup>
import{useNotification} from "@/Composable/useNotification.js";
import CustomButton from "@/components/CustomButton.vue";
const{state,close}=useNotification();
</script>

<template>
<div v-if="state.isVisible" class="overlay" @click.self="close">

  <div class="modal-card":class="state.type">
    <h3>{{state.type==='success'?'!Éxito¡':'Error'}}</h3>
    <CustomButton
      label="Aceptar"
      @click="close"></CustomButton>
  </div>
</div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: auto;
  max-width: 400px;
  text-align: center;
  border-left: 2px solid;
}
.success {
  border-color: var(--color-brand-40);
  color: var(--color-brand-40);
}

.error {
  border-color: var(--color-error-40);
  color: var(--color-error-40);
}
</style>