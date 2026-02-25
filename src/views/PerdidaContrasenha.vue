<script setup>
import { ref, computed } from 'vue'
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import {useRouter} from "vue-router";
import CustomBack from "@/components/CustomBack.vue";
const router= useRouter();
// Estado del formulario
const form = ref({
  username: ''
})

const attemptedUser = ref(false)

const usernameError = computed(() => {
  if (attemptedUser.value && !form.value.username) {
    return 'El usuario es obligatorio para la recuperación'
  }
  return ''
})

const buttonStatus = computed(() => {
  return !form.value.username ? 'disable' : 'default'
})

const handleResetRequest = () => {
  attemptedUser.value = true

  if (!form.value.username) {
    console.warn("Campo vacío")
    return
  }


  router.push('/confirmCode');
  console.log("Enviando correo para:", form.value.username)
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
        <h4>Enviaremos un correo de recuperación de contraseña.</h4>
      </div>

      <p v-if="usernameError" class="server-error">
        {{ usernameError }}
      </p>

      <custom-input
          label="Confirme su usuario 👤"
          v-model="form.username"
          placeholder="Ingrese su usuario"
          :hasError="!!usernameError"
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
/* Mantengo tus estilos originales */
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
  padding: 20px;
  gap: 30px;
  width: 100%;
  max-width: 376px;
  border-radius: 20px 0 0 20px;
  background-color: #ffffff;
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
</style>