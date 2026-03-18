<script setup>
import { useCrearCliente } from "@/Composable/CrearCliente.js";
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";

const { form, loading, error, saveCliente} = useCrearCliente();

const handleCrear = async () => {
    try {
        const nuevoCliente = await saveCliente();
        alert(`Cliente "${nuevoCliente.firstName}" creado con éxito`);
    } catch (e) {
        console.error("Error al crear:", e);
    }
};
</script>

<template>
    <div class="container-card">
        <div class="container-form">
            <CustomInput label='Numero de documento' placeholder='Ingrese cedula' v-model="form.documentNumber" />

            <CustomInput label="Nombres" placeholder="Ingrese el nombre" v-model="form.firstName" />

            <CustomInput label="Apellidos" placeholder="Ingrese los apellidos" v-model="form.lastName" />

            <CustomInput label="Email" placeholder="Ingrese un Email" v-model="form.email" />

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