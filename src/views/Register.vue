<script setup>
import {useAuthStore} from "@/stores/auth.store.js";
import {useRouter} from "vue-router";
import {reactive, ref} from "vue";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import { useNotification } from '@/Composable/useNotification.js';
import CustomBack from "@/components/CustomBack.vue";
const { notify } = useNotification();

const authStore = useAuthStore();
const router = useRouter();
const showPassword=ref(false);

const form = reactive({
  username: '',
  email: '',
  password: '',
  firstName: ''
});

const localError = ref(null);

const onSubmit = async () => {
  localError.value = null;
  if (form.password !== form.confirmPassword) {
    localError.value = "Las contraseñas no coinciden";
    return;
  }
  try {
    const {confirmPassword, ...userData} = form;
    await authStore.register(userData);
    notify("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
    router.push('/login');
  } catch (error) {
    const msjError=authStore.error||"Hubo un problema al registrarte";
    notify(msjError,"error")

    console.error("\"Error en el componente de registro:\", error");
  }
};
</script>

<template>
  <div class="register-container">

    <div class="img-container">
      <img src="../assets/Logo.png">
    </div>

    <div class="form-container">

      <CustomBack/>

      <div class="text-container">
        <span class="title">Crea tú usuario</span>
      </div>

      <custom-input
          label="Primer nombre"
          v-model="form.firstName"
          placeholder="Ingrese su primer nombre"
      />
      <custom-input
          label="Usuario 👤"
          v-model="form.username"
          placeholder="Ingrese su usuario"
      />
      <custom-input
          label="Email"
          v-model="form.email"
          placeholder="Ingrese su email"
      />
      <custom-input
          label="Contraseña 🔒"
          v-model="form.password"
          :type="showPassword?'text':'password'"
          placeholder="Ingrese su contraseña"
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
      </custom-input>
      <custom-input
          label="Confirmar contraseña"
          v-model="form.confirmPassword"
          :type="showPassword?'text':'password'"
          placeholder="Ingrese su contraseña"
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
      </custom-input>
      <p v-if="localError" class="error-text">{{ localError }}</p>
      <p v-if="authStore.error" class="server-error">{{ authStore.error }}</p>

      <custom-button
          label="Registrarme"
          :disabled="authStore.loading"
          @click="onSubmit"
      />
    </div>
  </div>
</template>

<style scoped>
.register-container{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0;
  background: var(--color-brand);
}

.img-container{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-brand);
}
.img-container img{
  width: 223px;
  display: block;
}
.title{
  font-size: 20px;
  color: var(--color-brand-30);
}
.form-container{
  display: flex;
  flex-direction: column;
  width: auto;
  height: 100%;
  gap: 8px;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  border-radius: 20px 0 0 20px;
  background: linear-gradient(to bottom,var(--color-brand-90),#ffffff)
}
.text-container{
  width: auto;
  height: auto;
  padding: 0;
  display: flex;
  margin: 0;
}
</style>