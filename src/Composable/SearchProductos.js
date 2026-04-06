import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth.store.js";
// Importamos las funciones necesarias de tu archivo API
import {
    searchProducts,
    getProductById,
    getProductByCode
} from "@/api/inventory.api.js";

export function searchProductos() {
    const authStore = useAuthStore();
    const searchQuery = ref('');
    const productos = ref([]);

    const obtenerProductos = async (termino = '') => {
        try {
            const query = termino.trim();

            // 1. Caso: Buscador vacío (Trae todos vía búsqueda vacía)
            if (query === '') {
                productos.value = await searchProducts('');
                return;
            }

            // 2. Caso: ¿Es un ID numérico corto?
            if (/^\d+$/.test(query) && query.length < 6) {
                const data = await getProductById(query);
                productos.value = data ? [data] : [];
            }

            // 3. Caso: ¿Es un Código (Empieza con M o es largo)?
            else if (query.toLowerCase().startsWith('m') || query.length >= 8) {
                const data = await getProductByCode(query);
                productos.value = data ? [data] : [];
            }

            // 4. Caso: Búsqueda por Nombre (Default)
            else {
                productos.value = await searchProducts(query);
            }

        } catch (error) {
            // Manejo de errores centralizado
            if (error.response && error.response.status === 401) {
                console.error("Sesión expirada");
                authStore.logout();
            }
            productos.value = [];
        }
    };

    onMounted(() => obtenerProductos());

    watch(searchQuery, (nuevoValor) => {
        const val = nuevoValor.trim();
        if (val.length >= 3 || /^\d+$/.test(val)) {
            obtenerProductos(val);
        } else if (val.length === 0) {
            obtenerProductos();
        }
    });

    return {
        searchQuery,
        productos,
        obtenerProductos
    };
}