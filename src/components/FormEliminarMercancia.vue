<script setup>
import { ref } from "vue"; // Importante importar ref
import { useEliminarMercancia } from "@/Composable/eliminarMercacia.js";
import { useNotification } from "../Composable/useNotification";
import { useSearchMercancia } from "../Composable/SearchMercancia";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import SearchMercancia from "./SearchMercancia.vue";

const { notify } = useNotification();
const { eliminarMercancia, loading, idMercancia } = useEliminarMercancia();
const {
    searchQuery,
    mercancias,
    obtenerMercancias,
    setMercanciaData
} = useSearchMercancia();

// --- SOLUCIÓN: Definimos el estado del formulario ---
const form = ref({
    nombre: ""
});

const handleEliminar = async () => {
    try {
        await eliminarMercancia();
        notify("Mercancía eliminada con éxito", "success");
        obtenerMercancias();
        // Limpiamos el input tras eliminar
        form.value.nombre = ""; 
    } catch (e) {
        notify("Error al eliminar la mercancía", "error");
    }
};

const mercanciaSeleccionada = (mercancia) => {
    console.log("🎯 [UI] Mercancía clickeada:", mercancia);
    
    // 1. Actualizamos el Composable (si lo necesitas allí)
    setMercanciaData(mercancia);
    
    // 2. Sincronizamos el ID para la eliminación
    idMercancia.value = mercancia.id; 

    // 3. ACTUALIZAMOS EL INPUT:
    // Asumiendo que tu objeto mercancía tiene la propiedad 'nombre'
    form.value.nombre = mercancia.nombre; 
};

</script>

<template>
    <div class="container-card">
        <div class="container-form">
            <SearchMercancia 
                titulo="Mercancías" 
                placeholder="Buscar mercancía..." 
                :productos="mercancias"
                v-model:searchQuery="searchQuery" 
                @select="mercanciaSeleccionada" 
            />

            <CustomInput 
                label="Nombre" 
                placeholder="Ingrese el nombre" 
                v-model="form.nombre" 
            />

            <CustomButton 
                :label="loading ? 'Cargando...' : 'Eliminar'" 
                :disabled="loading" 
                @click="handleEliminar" 
            />
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