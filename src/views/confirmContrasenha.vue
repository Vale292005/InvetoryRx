<script setup>
import { ref, computed } from 'vue'
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import router from "@/router/index.js";
import CustomBack from "@/components/CustomBack.vue";


const form = ref({
  code: '' // Nombre correcto de la propiedad
})

const attemptedUser = ref(false)

const codeError = computed(() => {
  if (attemptedUser.value && !form.value.code) {
    return 'El código es obligatorio'
  }
  return ''
})

const buttonStatus = computed(() => {
  return !form.value.code ? 'disable' : 'default'
})

const handleResetRequest = () => {
  attemptedUser.value = true

  if (!form.value.code) {
    return
  }

  console.log("Validando código:", form.value.code)
  // Aquí iría la lógica para enviar el código al servidor
  router.push('/nuevaContrasenha')
}
</script>

<template>
  <div class="container-branch">
    <div class="container-logo">
      <img src="@/assets/Logo.png" alt="Logo de InventoryRX"/>
    </div>

    <div class="conteiner-form">
      <CustomBack/>

      <div class="text">
        <h4>Ingrese el código recibido.</h4>
      </div>

      <p v-if="codeError" class="server-error">
        {{ codeError }}
      </p>

      <custom-input
          label="Código 🔑"
          v-model="form.code"
          placeholder="Ingrese el código"
          :hasError="!!codeError"
      />

      <custom-button
          label="Enviar"
          :type="buttonStatus"
          @click="handleResetRequest"
      />
    </div>
  </div>
</template>

<style scoped>
/* Estilos nuevos para el botón de regresar */
.back-navigation {
  align-self: flex-start;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: -10px;
  transition: color 0.2s;
}

.back-navigation:hover {
  color: var(--color-brand, #121b1e);
  font-weight: bold;
}

.back-icon {
  font-size: 20px;
}

/* --- Tus estilos originales --- */
.container-branch {
  display: flex;
  flex-direction: row;
  background-color: var(--color-brand);
  justify-content: end;
  width: 100%;
  height: 100vh;
}

@media (max-width: 768px) {
  .container-branch {
    flex-direction: column;
    align-items: center;
    height: auto;
    min-height: 100vh;
    gap: 20px;
  }
}

.container-logo {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.container-logo img {
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: contain;
}

.conteiner-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px; /* Ajustado el padding */
  gap: 30px;
  width: 100%;
  max-width: 376px;
  border-radius: 20px 0 0 20px;
  background-color: #ffffff;
  position: relative;
}

.text {
  padding: 0 20px;
}
.text h4{
  color: #121b1e;
  font-weight: bold;
}

.server-error {
  color: #ff4d4f;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  padding: 10px;
  border-radius: 8px;
  width: 90%;
  font-size: 14px;
  text-align: center;
}

@media (max-width: 780px) {
  .conteiner-form {
    border-radius: 20px 20px 0 0;
  }
}
.back-circle {
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px; /* Tamaño un poco más grande */
  height: 50px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: -10px;
}

.back-circle:hover {
  background-color: #ffffff;
  border-color: #121b1e;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transform: translateX(-4px);
}

.back-icon {
  font-size: 28px; /* Flecha grande y clara */
  color: #121b1e;
  line-height: 1;
}
</style>