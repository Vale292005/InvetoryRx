<script setup>
import { useCrearProveedor } from '../Composable/useCrearProveedor';
import CustomInput from '@/components/CustomInput.vue';
import CustomButton from '@/components/CustomButton.vue';
import { useNotification } from '@/Composable/useNotification';

const { notify } = useNotification();

const { form, loading, error, resetForm, saveProveedor } = useCrearProveedor();

const handleCrear = async () => {
    try {
        await saveProveedor();
        notify("Proveedor creado con éxito", "success");
        console.log("Proveedor creado:", form);
    } catch (e) {
        console.error("Error al crear el proveedor", e);
        notify("Error al crear el proveedor", "error");
    }
};
</script>
<template>
    <div class="container-card">
        <div class="container-form">
            <Custom-input label="Código" placeholder="Ingrese el código del proveedor" v-model="form.code" />
            <Custom-input label="Nombre" placeholder="Ingrese el nombre del proveedor" v-model="form.name" />
            <Custom-input label="Email" placeholder="Ingrese el email del proveedor" v-model="form.email" />
            <Custom-input label="Número de contacto" placeholder="Ingrese el número de contacto" v-model="form.contactNumber" />
            <Custom-input label="Dirección" placeholder="Ingrese la dirección del proveedor" v-model="form.address" />
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