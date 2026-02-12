<script setup>
import {computed, ref} from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  user: '',
  password: ''
})
const attemptedLogin=ref(false)

const userError = computed(() => {
  if (!attemptedLogin.value)return ''
  if (!form.value.user)return 'El usuario es obligatorio'
  return ''
})

const passwordError=computed(()=>{
  if(!attemptedLogin.value)return''
  if(!form.value.password)return 'La contraseña es obligatoria'
  return ''
})

const buttonStatus=computed(()=>{
  if(!form.value.user || !form.value.password){
    return 'disable'
  }
  return 'default'
})
const handleLogin = async () => {
  attemptedLogin.value=true

  if(!form.value.user||!form.value.password)return

  try {
    await authStore.login(form.value)
    router.push('/inventory')
  } catch (err) {
    console.error("Fallo el login en el componente")
  }
}
</script>

<template>
<div class="container-branch">
  <div class="container-logo">
    <img src="@/assets/Logo.png" alt="Logo de InventoryRX"/>
  </div>

  <div class="conteiner-form">
    <custom-input
        label="Usuario"
        v-model="form.user"
        placeholder="Ingrese su usuario"
        :hasError="!!userError"
        :hasMsg="userError"
    />
    <custom-input
        label="Contraseña"
        v-model="form.password"
        placeholder="Ingrese su contraseña"
        :hasError="!!passwordError"
        :hasMsg="passwordError"
    >
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
.container-logo{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  height: 100%;
  width: 100%;
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
</style>