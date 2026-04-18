<script setup>
import { ref } from "vue";
import { useUpdateUser } from "@/Composable/actualizarUsuario";
import CustomInput from "@/components/CustomInput.vue";
import Accordion from "@/components/Accordion.vue";
import CustomButton from "@/components/CustomButton.vue";
import SearchResults from "@/components/SearchResults.vue";
import { useSearchUsuarios } from '@/Composable/useSearchUsuarios';

const {
  form,
  loading,
  error,
  idUsuario,
  searchAndFill,
  updateUser,
  setUserData
} = useUpdateUser();
const { searchQuery: searchQueryUsuarios, usuarios, loading: loadingUsuarios } = useSearchUsuarios();
const seleccionarUsuario = (usuario) => {
  setUserData(usuario);
  idUsuario.value = usuario.id;
};

// Definimos el estado para el campo de búsqueda de username
const usernameBusqueda = ref("");

// Roles disponibles en tu sistema (puedes usar un Enum si lo tienes)
const opcionesRoles = ['USER', 'ADMIN', 'SALES'];

const handleSearch = async () => {
  if (!usernameBusqueda.value) return;
  await searchAndFill(usernameBusqueda.value);
};

const handleActualizar = async () => {
  try {
    await updateUser();
  } catch (e) {
    console.error("Error al actualizar usuario:", e);
  }
};

const labels = ref([
  'Actualizar Usuario',
  'Nombre de Usuario (Buscar)',
  'Email',
  'Nombre',
  'Apellido',
  'Rol'
]);
</script>

<template>
  <div class="container-card">
    <div class="container-form">
      <!-- Sección de Búsqueda por Username -->
      <div class="search-section">
        <SearchResults titulo="Usuarios" placeholder="Buscar usuario..." :productos="usuarios"
          v-model:searchQuery="searchQueryUsuarios" @select="seleccionarUsuario" />
      </div>

      <hr class="separator" v-if="idUsuario" />

      <!-- Campos del Formulario (se llenan tras la búsqueda) -->
      <div v-if="idUsuario" class="form-fields">
            <CustomInput label='Numero de documento' placeholder='Ingrese cedula' v-model="form.documentNumber" />

            <CustomInput label="Nombres" placeholder="Ingrese el nombre" v-model="form.firstName" />

            <CustomInput label="Apellidos" placeholder="Ingrese los apellidos" v-model="form.lastName" />

            <CustomInput label="Email" placeholder="Ingrese un Email" v-model="form.email" />

            <CustomButton :label="loading ? 'Cargando...' : 'Crear'" :disabled="loading" @click="handleCrear" />
        <Accordion :title="labels[5]" :text="form.role || 'Seleccione un rol'" :items="opcionesRoles"
          @select="(item) => form.role = item" />

        <p v-if="error" class="error-text">{{ error }}</p>

        <CustomButton :label="loading ? 'Guardando...' : 'Actualizar Usuario'" :disabled="loading"
          @click="handleActualizar" />
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