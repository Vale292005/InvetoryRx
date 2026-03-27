<script setup>
import { ref } from "vue";
import { useActualizarProveedor } from "../Composable/useActualizarProveedor";

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
    idProveedor,
    searchAndFill,
    updateProveedor
}= useActualizarProveedor();

const handleActualizar = async() => {
    try{
        await updateProveedor();
    }catch(e){
        console.error("Error al actualizar proveedor:", e);
    }
};
</script>
<template>
  <div class="container-card">
    <div class="container-form">
      <!-- Sección de Búsqueda por Username -->
      <div class="search-section">
        <Custom-input 
          :label="labels[1]" 
          v-model="usernameBusqueda" 
          placeholder="Ej: valeria2026"
          @keyup.enter="handleSearch"
        />
        <CustomButton 
          label="Buscar" 
          :disabled="loading" 
          @click="handleSearch" 
          class="btn-search"
        />
      </div>

      <hr class="separator" v-if="idUsuario" />

      <!-- Campos del Formulario (se llenan tras la búsqueda) -->
      <div v-if="idUsuario" class="form-fields">
        <Custom-input label="Nombre" v-model="form.name" />
        <Custom-input label="Email" v-model="form.email" />
        <Accordion
          title="Elija una estado"
          :text="form.active || 'Seleccione un estado'"
          :items="{Activo: true, Inactivo: false}"
          @select="(item) => form.role = item"
        />

        <p v-if="error" class="error-text">{{ error }}</p>

        <CustomButton
          :label="loading ? 'Guardando...' : 'Actualizar Usuario'"
          :disabled="loading"
          @click="handleActualizar"
        />
      </div>
      
      <p v-else class="info-text">Busca un usuario para editar sus datos.</p>
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
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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