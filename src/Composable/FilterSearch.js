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
        products: { param: 'category', endpoint: 'api/products',useSearch: true},
        users: { param: 'role', endpoint: 'api/users',useSearch: false},
        customers: { param: 'status', endpoint: 'api/customers',useSearch: false}
    };

    const buscar = async () => {
        cargando.value = true;
        try {
            const token = authStore.token;
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const setup = configEntidad[entity] || configEntidad.products;
            
            const tieneTexto = searchQuery.value.trim().length > 0;
            
            let url = `${BASE_URL}/${setup.endpoint}`;

            if (setup.useSearch) {
                if (tieneTexto) url += '/search';
                
                const params = new URLSearchParams();
                if (tieneTexto) params.append('name', searchQuery.value.trim());
                if (categoriaSeleccionada.value !== 'Todos') params.append(setup.param, categoriaSeleccionada.value);
                
                if (params.toString()) url += `?${params.toString()}`;
            }

            console.log(`📡 Petición a ${entity}:`, url);

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