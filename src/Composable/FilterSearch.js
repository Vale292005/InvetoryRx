import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store.js";

export function useFilteredSearch(entity='products') {
    const authStore = useAuthStore();
    const searchQuery = ref('');
    const categoriaSeleccionada = ref('Todos'); 
    const productos = ref([]);
    const cargando = ref(false);

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const configEntidad = {
        products: { param: 'category', endpoint: 'api/products' },
        users: { param: 'role', endpoint: 'api/users' },
        customers: { param: 'status', endpoint: 'api/customers' }
    };

    const buscar = async () => {
        cargando.value = true;
        try {
            const token = authStore.token;
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            const setup = configEntidad[entity] || configEntidad.products;

            let url = `${BASE_URL}/${setup.endpoint}/search?name=${searchQuery.value.trim()}`;

            if (categoriaSeleccionada.value !== 'Todos') {
                url += `&${setup.parm}=${categoriaSeleccionada.value}`;
            }

            const response = await axios.get(url, config);
            productos.value = response.data;
        } catch (error) {
            console.error(`Error en búsqueda filtrada de ${entity}:`, error);
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