import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store.js";

export function useFilteredSearch() {
    const authStore = useAuthStore();
    const searchQuery = ref('');
    const categoriaSeleccionada = ref('Todos'); // Nuevo estado
    const productos = ref([]);
    const cargando = ref(false);

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const buscar = async () => {
        cargando.value = true;
        try {
            const token = authStore.token;
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            let url = `${BASE_URL}/api/products/search?name=${searchQuery.value}`;

            if (categoriaSeleccionada.value !== 'Todos') {
                url += `&category=${categoriaSeleccionada.value}`;
            }

            const response = await axios.get(url, config);
            productos.value = response.data;
        } catch (error) {
            console.error("Error en búsqueda filtrada", error);
            productos.value = [];
        } finally {
            cargando.value = false;
        }
    };

    watch([searchQuery, categoriaSeleccionada], () => {
        buscar();
    });

    onMounted(() => buscar());

    return {
        searchQuery,
        categoriaSeleccionada,
        productos,
        cargando,
        buscar
    };
}