<script setup>
import { useEliminarUsuario } from '../Composable/useEliminarUser';
import CustomInput from '@/components/CustomInput.vue';
import CustomButton from '@/components/CustomButton.vue';
import { useNotification } from '@/Composable/useNotification';
import SearchResults from './SearchResults.vue';
import Accordion from '@/components/Accordion.vue';
import { useSearchUsuarios } from '@/Composable/useSearchUsuarios';

const { searchQuery: searchQueryUsuarios, usuarios, loading: loadingUsuarios } = useSearchUsuarios();
const { notify } = useNotification();

const { form, loading, error, resetForm, eliminarUsuario, setUserData } = useEliminarUsuario();

const handleEliminar = async () => {
    try {
        await eliminarUsuario();
        if (!error.value) {
            notify("Usuario eliminado con éxito", "success");
            resetForm();
        }
    } catch (e) {
        console.error(e);
        notify("Error al eliminar usuario", "error");
    }
};

// Función para manejar la selección de un usuario desde los resultados de búsqueda
const usuarioSeleccionado = (usuario) => {
    setUserData(usuario);
};
</script>
<template>
    <div class="container-card">
        <div class="container-form">
            <SearchResults titulo="Usuarios" placeholder="Buscar usuario..." :productos="usuarios"
                v-model:searchQuery="searchQueryUsuarios" @select="usuarioSeleccionado" />
            <CustomInput label="Usuario" placeholder="Ingrese el usuario" v-model="form.username" />
            <CustomInput label="Email" placeholder="Ingrese el email" v-model="form.email" />
            <CustomInput label="Nombre" placeholder="Ingrese el nombre" v-model="form.firstname" />
            <Accordion title="Rol" :text="form.role || 'Ingrese el rol'" />

            <CustomButton :label="loading ? 'Guardando...' : 'Eliminar Usuario'" :disabled="loading"
                @click="handleEliminar" />
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
    max-width: 325px;
    height: auto;
    gap: 10px;
    padding: 16px 24px;
    box-sizing: border-box;
    align-items: center;
}
</style>