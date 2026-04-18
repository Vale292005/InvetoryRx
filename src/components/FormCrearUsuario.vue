<script setup>
import { useCrearUsuario } from '../Composable/useCrearUser';
import CustomInput from '@/components/CustomInput.vue';
import CustomButton from '@/components/CustomButton.vue';
import Accordion from '@/components/Accordion.vue';

const opciones=['ADMIN', 'USER', 'MANAGER', 'SALES'];

const { form, loading, error, resetForm, saveUsuario } = useCrearUsuario();

const handleCrear = async () => {
    try {
        await saveUsuario();
    } catch (e) {
        console.error("Error al crear el usuario", e);
    }
};

const alSeleccionar = (item) => {
    form.value.role = item; 
};
</script>
<template>
    <div class="container-card">
        <div class="container-form">
            <Custom-input label="Usuario" placeholder="Ingrese el usuario" v-model="form.username" />
            <Custom-input label="Email" placeholder="Ingrese el email" v-model="form.email" />
            <Custom-input label="Password" placeholder="Ingrese una contraseña" v-model="form.password" />
            <Custom-input label="Nombres" placeholder="Ingrese su nombre" v-model="form.firstName" />
            <Custom-input label="Apellido" placeholder="Ingrese su apellido" v-model="form.lastName" />
                  <Accordion title="Categoría" :text="form.role || 'Seleccione una opción'" :items="opciones"
        @select="alSeleccionar" />

            <CustomButton :label="loading ? 'Cargando...' : 'Crear'" :disabled="loading" @click="handleCrear" />
            <p v-if="error" style="color: red; font-size: 12px;">{{ error }}</p>
        </div>
    </div>
</template>

<style scoped>
.container-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    background: white;
}

.container-button {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    gap: 10px;
    padding: 10px 20px;
    border-radius: 6px;
}

.container-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 10px;
    padding: 16px 24px;
    box-sizing: border-box;
    align-items: center;
}
</style>