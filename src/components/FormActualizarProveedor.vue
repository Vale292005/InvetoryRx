<script setup>
import { ref } from "vue";
import { useActualizarProveedor } from "../Composable/useActualizarProveedor";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import SearchResults from "@/components/SearchResults.vue";
import { useSearchProveedores } from "@/Composable/useSearchProveedores";

const proveedorBusqueda = ref("");
const handleSearch = () => {
  // Aquí iría la lógica para buscar al proveedor por su nombre o ID
  console.log("Buscando proveedor:", proveedorBusqueda.value);
};
// Importamos el composable para actualizar proveedor
const {
  form,
  loading,
  error,
  updateProveedor,
  resetForm,
  setProductorData
} = useActualizarProveedor();

const handleActualizar = async () => {
  try {
    await updateProveedor();
  } catch (e) {
    console.error("Error al actualizar proveedor:", e);
  }
};

// Logica para manjera busqueda y seleccion de proveedor
const { searchQuery, proveedores, loading: loadingProveedores } = useSearchProveedores();

const proveedorSeleccionado = (proveedor) => {
  setProductorData(proveedor); // Esto rellena los campos automáticamente
};
</script>
<template>
  <div class="container-card">
    <div class="container-form">
      <div class="search-section">

        <SearchResults titulo="Proveedores" placeholder="Buscar proveedor..." :productos="proveedores"
                           v-model:searchQuery="searchQuery" @select="proveedorSeleccionado" />

        <Custom-input label="Nombre" v-model="form.name" placeholder="Ingrese el nombre del proveedor"/>
          <Custom-input label="Email" v-model="form.email" placeholder="Ingrese el email del proveedor"/>
        <CustomButton label="Actualizar" :disabled="loading" @click="handleActualizar" class="btn-search" />
      </div>

      <hr class="separator" v-if="idUsuario" />
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.container-card {
  display: flex;
  flex-direction: column;
  width: 325px;
  height: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.container-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 12px;
  padding: 16px 24px;
  box-sizing: border-box;
  align-items: center;
}

.search-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.separator {
  width: 100%;
  border: 0;
  border-top: 1px solid #eee;
  margin: 10px 0;
}

.error-text {
  color: red;
  font-size: 12px;
  text-align: center;
}

.info-text {
  color: #666;
  font-size: 13px;
  text-align: center;
  margin-top: 10px;
}

.btn-search {
  background-color: #f0f0f0;
  color: #333;
}
</style>