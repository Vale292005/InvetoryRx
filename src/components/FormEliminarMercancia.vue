<script setup>
import { useEliminarMercancia } from "@/Composable/useEliminarMercancia.js";
import { useNotification } from "../Composable/useNotification";
import { useSearchMercancia } from "../Composable/SearchMercancia";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import SearchResults from "./SearchResults.vue";

const notify = useNotification();
const { eliminarMercancia, loading } = useEliminarMercancia();
const { searchQuery,
    mercancias,
    obtenerMercancias } = useSearchMercancia();

const handleEliminar = async () => {
    try {
        await eliminarMercancia();
        notify("Mercancía eliminada con éxito", "success");
        obtenerMercancias();
    } catch (e) {
        notify("Error al eliminar la mercancía", "error");
    }
};

const mercanciaSeleccionada = (mercancia) => {
    setMercanciaData(mercancia);
};

</script>
<template>
    <div class="container-card">
        <div class="container-form">
            <SearchResults titulo="Mercancías" placeholder="Buscar mercancía..." :productos="mercancias"
                v-model:searchQuery="searchQuery" @select="mercanciaSeleccionada" />
            <Custom-input label="Nombre" placeholder="Ingrese el nombre" v-model="form.nombre" />

            <CustomButton :label="loading ? 'Cargando...' : 'Eliminar'" :disabled="loading" @click="handleEliminar" />
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