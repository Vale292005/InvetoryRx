<script setup>
import { ref, computed } from 'vue'
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import {useRouter} from "vue-router";
import CustomBack from "@/components/CustomBack.vue";
import { useAuthStore } from '@/stores/auth.store'

const router= useRouter();
const authStore = useAuthStore();

// Estado del formulario
const form = ref({
  email: ''
});

const attemptedUser = ref(false);
const serverErrorMessage = ref('');
const isSuccess = ref(false);

const emailError = computed(() => {
  if (attemptedUser.value && !form.value.email) {
    return 'El correo es obligatorio para la recuperación'
  }
  return ''
})

const buttonStatus = computed(() => {
  return !form.value.email ? 'disable' : 'default'
})

const handleResetRequest = async() => {
  attemptedUser.value = true
  serverErrorMessage.value = ''

  if (!form.value.email) {
    console.warn("Campo vacío")
    return
  }try{
    await authStore.forgotPassword(form.value.email)
    isSuccess.value = true
    setTimeout(()=>{
      router.push('/confirmCode');
    },3000)
  }catch(e){
    console.error("Error al enviar correo de recuperación:", e)
    serverErrorMessage.value = 'No se pudo enviar el correo. Intente nuevamente.'
  }
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
          label="Confirme su email ✉️"
          v-model="form.email"
          placeholder="Ingrese su email"
          :hasError="!!emailError"
      />

      <custom-button
          :label="authStore.loading ? 'Enviando...':'Enviar'"
          :type="authStore.loading ? 'disabled':'buttonStatus'"
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