<script setup>
import ButtonForm from "@/components/ButtonForm.vue";
import { onMounted, ref } from "vue";
import SearchProduct from "@/components/SearchProduct.vue";
import { useAuthStore } from "@/stores/auth.store.js";
import { useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import { useCrearMercancia } from "@/Composable/useCrearMercancia.js";
import { useNotification } from "../Composable/useNotification";
import SearchResults from "../components/SearchResults.vue";
import { useSearchMercancia } from "../Composable/SearchMercancia";


const notify = useNotification();
const { form, loading, error, saveMercancia } = useCrearMercancia();

const { searchQuery, mercancias, obtenerMercancias } = useSearchMercancia();

const authStore = useAuthStore();
const username = authStore.user?.username || 'Usuario';
const route = useRouter();

const productoColumnas = ref([
    { label: 'Producto', key: 'nombre' },
    { label: 'Cantidad', key: 'cantidad' },
    { label: 'Código', key: 'codigo' }
]);
const productoFilas = ref([
    { nombre: 'Producto de prueba', cantidad: 10, codigo: '001' }
]);

const busqueda = ref('');

const handleSearch = (valor) => {
    busqueda.value = valor;
    console.log(busqueda.value);
}
</script>

<template>
    <div class="dashboard-contaianer">
        <div class="header-container">
            <sidebar />
        </div>
        <div class="hello-container">
            <h3>Bienvenido, {{ username }}!</h3>
        </div>

        <div class="buttons-container">
            <div class="crear-container">
                <ButtonForm title="Crear mercancía" />
            </div>
            <div class="actualizar-container">
                <ButtonForm title="Eliminar mercancía" />
            </div>
        </div>
        <div class="prodc-container">
            <SearchProduct placeholder="Buscar producto por código" :productos="productos" :cargando="cargando"
                v-model:searchQuery="searchQuery" />
        </div>

        <div class="search-container">
            <SearchResults titulo="Mercancías" placeholder="Buscar mercancía..." :productos="mercancias"
                v-model:searchQuery="searchQuery" @select="mercanciaSeleccionada" />
        </div>
    </div>
</template>

<style scoped>
.dashboard-contaianer {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 10px;

    background: linear-gradient(to bottom, var(--color-brand-90), #ffffff);

}

.header-container {
    width: 100%;
    height: auto;
    justify-content: left;
    padding: 10px;
    background: linear-gradient(to bottom, var(--color-brand-80), var(--color-brand-90));
}

.header-container img {
    width: 210px;
    height: auto;
}

.hello-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px 0;
    color: var(--color-brand-20);
}

.menu-item {
    cursor: pointer;
    margin: 0;
    color: var(--color-brand-30);
}

.buttons-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 10px;
    padding: 10px 20px;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

@media(min-width: 760px) {
    .menu-container {
        gap: 0;
        justify-content: space-between;
    }

    .buttons-container {
        flex-direction: row;
        align-items: start;
    }
}

.table-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 10px;
    padding: 20px 20px;
}

.search-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 10px;
    padding: 10px 20px;
}

.crear-container,
.actualizar-container,
.eliminar-container,
.activar-container {
    width: auto;
    height: auto;
    border: 1px solid var(--color-brand-30);
    border-radius: 6px;
}
</style>