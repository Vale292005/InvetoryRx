<!-- 
<script setup>
import { searchProductos } from "@/Composable/SearchProductos.js";
import { eliminarCliente } from "../Composable/UseEliminarCliente";
import CustomButton from "@/components/CustomButton.vue";
import SearchProduct from "@/components/SearchProduct.vue";

const { searchQuery, clientes, cargando } = searchProductos();
const { clienteParaEliminar, loading, error, deleteCliente, setClienteAEliminar } = eliminarCliente();

const clienteSeleccionado = (cli) => {
  setClienteAEliminar(cli);

};

const handleEliminar = async () => {
  if (confirm(`¿Estás seguro de eliminar a ${clienteParaEliminar.value.firstName}?`)) {
    try {
      await deleteCliente();
      alert("Cliente eliminado con éxito");
    } catch (e) {
      console.error("Error al eliminar:", e);
    }
  }
};
</script>

<template>
  <div class="container-card">
    <div class="container-form">
      <SearchProduct
          placeholder="Buscar cliente para eliminar..."
          :productos="clientes" 
          :cargando="cargando"
          v-model:searchQuery="searchQuery"
          @select="clienteSeleccionado"
      />

      <div v-if="clienteParaEliminar" class="confirmacion-borrado">
          <div class="info-cliente">
              <p><strong>Cédula:</strong> {{ clienteParaEliminar.documentNumber }}</p>
              <p><strong>Nombre:</strong> {{ clienteParaEliminar.firstName }} {{ clienteParaEliminar.lastName }}</p>
              <p><strong>Email:</strong> {{ clienteParaEliminar.email }}</p>
          </div>
          
          <p class="warning-text">⚠️ Esta acción no se puede deshacer.</p>

          <CustomButton
              :label="loading ? 'Eliminando...' : 'Confirmar Eliminación'"
              :disabled="loading"
              style="--color-brand-10: #d32f2f;" 
              @click="handleEliminar"
          />
      </div>
      
      <p v-else style="font-size: 12px; color: gray;">Busque un cliente para proceder</p>
      
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
.info-cliente {
    background: #f9f9f9;
    padding: 12px;
    border-radius: 6px;
    font-size: 14px;
    border-left: 4px solid #d32f2f;
}
.confirmacion-borrado {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.warning-text {
    color: #d32f2f;
    font-size: 11px;
    font-weight: bold;
    text-align: center;
}
</style> -->