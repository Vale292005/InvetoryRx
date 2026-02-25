import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store.js";

export function searchProductos() {
    const authStore = useAuthStore();
    const searchQuery = ref('');
    const productos = ref([]);

    const obtenerProductos = async (termino = '') => {
        try {
            const token = authStore.token;
            if (!token) return;

            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };

            const baseUrl = 'http://localhost:8080/api/products';
            const query = termino.trim();

            // 1. Si el buscador está vacío, traemos todos (usando el search con nombre vacío)
            if (query === '') {
                const response = await axios.get(`${baseUrl}/search`, { ...config, params: { name: '' } });
                productos.value = response.data;
                return;
            }

            // 2. ¿Es un ID? (Solo números y longitud corta, ej: menos de 6 dígitos)
            if (/^\d+$/.test(query) && query.length < 6) {
                const response = await axios.get(`${baseUrl}/${query}`, config);
                // Convertimos el objeto único en un array [producto] para no romper el v-for
                productos.value = response.data ? [response.data] : [];
            }

            // 3. ¿Es un Código? (Empieza con 'm' o longitud considerable)
            else if (query.toLowerCase().startsWith('m') || query.length >= 8) {
                const response = await axios.get(`${baseUrl}/code/${query}`, config);
                productos.value = response.data ? [response.data] : [];
            }

            // 4. Búsqueda por Nombre (Default)
            else {
                const response = await axios.get(`${baseUrl}/search`, {
                    ...config,
                    params: { name: query }
                });
                productos.value = response.data;
            }

        } catch (error) {
            if (error.response && error.response.status === 401) {
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