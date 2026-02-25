import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store.js";

export function searchProductos() {
    const authStore = useAuthStore();
    const searchQuery = ref('');
    const productos = ref([]);

    // 1. URL dinámica para Render o Localhost
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const obtenerProductos = async (termino = '') => {
        try {
            const token = authStore.token;
            if (!token) return;

            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };

            // Usamos la variable BASE_URL
            const baseUrl = `${BASE_URL}/api/products`;
            const query = termino.trim();

            // 1. Si el buscador está vacío
            if (query === '') {
                const response = await axios.get(`${baseUrl}/search`, { ...config, params: { name: '' } });
                productos.value = response.data;
                return;
            }

            // 2. ¿Es un ID?
            if (/^\d+$/.test(query) && query.length < 6) {
                const response = await axios.get(`${baseUrl}/${query}`, config);
                productos.value = response.data ? [response.data] : [];
            }

            // 3. ¿Es un Código?
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
            // Manejo automático del 401 (Unauthorized)
            if (error.response && error.response.status === 401) {
                console.error("Sesión expirada o token inválido");
                authStore.logout();
            }
            productos.value = [];
        }
    };

    onMounted(() => obtenerProductos());

    watch(searchQuery, (nuevoValor) => {
        const val = nuevoValor.trim();
        // Disparamos búsqueda si hay 3 letras o si es un número (ID)
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