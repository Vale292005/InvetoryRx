<script setup>
import { searchProductos } from "@/Composable/SearchProductos.js";
import { useActualizarCliente } from "@/Composable/useActualizarCliente.js";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import SearchProduct from "@/components/SearchProduct.vue";

const { searchQuery, clientes, cargando } = searchProductos();
const { form, loading, error, updateCliente, setClienteData } = useActualizarCliente();

const clienteSeleccionado = (cli) => {
  setClienteData(cli); 
};

const handleActualizar = async () => {
  try {
    await updateCliente();
    alert("Cliente actualizado con éxito");
  } catch (e) {
    console.error("Error en la actualización:", e);
  }
};
</script>

<template>
  <div class="container-card">
    <div class="container-form">
      <SearchProduct
          placeholder="Buscar cliente por nombre o cédula..."
          :productos="clientes" 
          :cargando="cargando"
          v-model:searchQuery="searchQuery"
          @select="clienteSeleccionado"
      />

      <div v-if="form.id" class="form-fields">
          <CustomInput label="Cédula" v-model="form.documentNumber" />
          <CustomInput label="Nombres" v-model="form.firstName" />
          <CustomInput label="Apellidos" v-model="form.lastName" />
          <CustomInput label="Email" v-model="form.email" />

          <CustomButton
              :label="loading ? 'Actualizando...' : 'Guardar Cambios'"
              :disabled="loading"
              @click="handleActualizar"
          />
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