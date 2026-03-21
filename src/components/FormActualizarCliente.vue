<script setup>
import { useSearchClientes } from "@/Composable/useSearchCliente.js";
import { useActualizarCliente } from "@/Composable/useActualizarCliente.js";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import SearchResults from "./SearchResults.vue";

const {
  searchQuery,
  resultado,
  loadingSearch,
  obtenerClientes
} = useSearchClientes();

const { form, loading: guardando, error, updateCliente, setClienteData } = useActualizarCliente();

const clienteSeleccionado = (cli) => {
  setClienteData(cli);
  console.log("Has seleccionado a:", clientes.firstName);
};

const handleActualizar = async () => {
  try {
    await updateCliente();
    alert("Cliente actualizado con éxito");
    obtenerClientes(searchQuery.value);
  } catch (e) {
  }
};
</script>

<template>
  <div class="container-card">
    <div class="container-form">
      <SearchResults titulo="Listado de Clientes" placeholder="Buscar por nombre..." :productos="resultado"
        v-model:searchQuery="searchQuery" @select="clienteSeleccionado" />

      <div v-if="form.id" class="form-fields">
        <CustomInput label="Cédula" v-model="form.documentNumber" />
        <CustomInput label="Nombres" v-model="form.firstName" />
        <CustomInput label="Apellidos" v-model="form.lastName" />
        <CustomInput label="Email" v-model="form.email" />

        <CustomButton :label="guardando ? 'Actualizando...' : 'Guardar Cambios'" :disabled="guardando"
          @click="handleActualizar" />
      </div>

      <p v-else style="font-size: 12px; color: gray;">Seleccione un cliente para editar</p>

      <p v-if="error" style="color: red; font-size: 12px;">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.container-card {
  width: 100%;
  max-width: 325px;
  background: white;
  border-radius: 0 0 8px 8px;
}

.container-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
</style>