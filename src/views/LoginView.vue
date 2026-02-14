<script setup>
import {computed, ref, watch} from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

const showPassword=ref(false)
const attemptedLogin=ref(false)
const serverErrorMessage=ref('')

watch(() => [form.value.username, form.value.password], () => {
  serverErrorMessage.value = ''
})

const userError = computed(() => {
  if (!attemptedLogin.value)return ''
  if (!form.value.username)return 'El usuario es obligatorio'
  return ''
})

const passwordError=computed(()=>{
  if(!attemptedLogin.value)return''
  if(!form.value.password)return 'La contraseña es obligatoria'
  return ''
})

const globalErrorMessage=computed(()=>{
  return serverErrorMessage.value||''
})

const buttonStatus=computed(()=>{
  if(!form.value.username || !form.value.password){
    return 'disable'
  }
  return 'default'
})
const handleLogin = async () => {
  attemptedLogin.value=true
  serverErrorMessage.value=''

  if(!form.value.username||!form.value.password)return

  try {
    await authStore.login(form.value)
    router.push('/inventory')
  } catch (err) {
    console.error("Fallo el login en el componente")
    serverErrorMessage.value='Usuario o contraseña incorrectos'
  }
}
</script>

<template>
<div class="container-branch">
  <div class="container-logo">
    <img src="@/assets/Logo.png" alt="Logo de InventoryRX"/>
  </div>

  <div class="conteiner-form">
    <p v-if="serverErrorMessage" class="server-error">
      {{ serverErrorMessage }}
    </p>
    <custom-input
        label="Usuario 👤"
        v-model="form.username"
        placeholder="Ingrese su usuario"
        :hasError="!!userError||!!serverErrorMessage"
        :hasMsg="userError"
    />
    <custom-input
        label="Contraseña 🔒"
        v-model="form.password"
        :type="showPassword?'text':'password'"
        placeholder="Ingrese su contraseña"
        :hasError="!!passwordError||!!serverErrorMessage"
        :hasMsg="passwordError"
    >
      <template #icon>
        <button
            type="button"
            @click="showPassword = !showPassword"
            style="background:none; border:none; cursor:pointer; padding:0;"
        >
          <span style="font-size: 20px;">{{ showPassword ? '👁️' : '🙈' }}</span>
        </button>
      </template>

      <template #msg>
        <a
            href="https://i.pinimg.com/236x/1e/a4/2f/1ea42fd2256e7d5a8e2bb165bcd52a92.jpg"
            target="_blank"
            rel="noopener noreferrer"
            class="message-link"
        >
          ¿Olvidó su contraseña?

          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </template>
    </custom-input>

    <custom-button
        label="Ingresar"
        :type="buttonStatus"
        @click="handleLogin"
    />

  </div>
</div>
</template>

<style scoped>
.container-branch{
  display: flex;
  flex-direction: row;
  background-color: var(--color-brand);
  justify-content: end;
  width: 100%;
  height: 100vh;
}
@media (max-width: 768px) {
  .container-branch{
    flex-direction: column;
    align-items: center;
    height: auto;
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow-x: hidden;
    gap: 20px;
  }
}
.container-logo{
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  height: 100%;
  width: 100%;
  min-width: 0;
}
.container-logo img{
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: contain;
}
@media (max-width: 768px) {
  .container-logo img{
    max-width: 251px;
  }
}
.conteiner-form{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap:40px;

  width: 100%;
  max-width: 376px;
  border-radius:20px 0 0 20px;
  background-color: #ffffff;
}
@media (max-width: 780px) {
  .conteiner-form{
    border-radius: 20px 20px 0 0;
  }
}
.server-error {
  color: #ff4d4f;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  font-size: 14px;
  text-align: center;
  margin-bottom: -20px; /* Ajusta según tu gap */
}
</style>