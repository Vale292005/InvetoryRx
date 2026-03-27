<script setup>
import { useCrearProveedor } from '../Composable/useCrearProveedor';
import CustomInput from '@/components/CustomInput.vue';
import CustomButton from '@/components/CustomButton.vue';
import Accordion from '@/components/Accordion.vue';

const { form, loading, error, resetForm, saveProveedor } = useCrearProveedor();

const handleCrear = async () => {
    try {
        await saveProveedor();
    } catch (e) {
        console.error("Error al crear el proveedor", e);
    }
};
</script>
<template>
    <div class="container-card">
        <div class="container-form">
            <Custom-input label="Proveedor" placeholder="Ingrese el nombre del proveedor" v-model="form.name" />
            <Custom-input label="Email" placeholder="Ingrese el email" v-model="form.email" />
            <Accordion title="Elija una opción" text="Estado" :items="['Activos', 'Inactivos']" />
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