import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.store.js';
import {
    getAllGoodsReceipts,
    getGoodsReceiptById,
    getGoodsReceiptByNumber
} from '@/api/bodega.js';

export function useSearchMercancia() {
    const authStore = useAuthStore();
    
    // Estados consistentes con useCrearMercancia
    const searchQuery = ref('');
    const mercancias = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const obtenerMercancias = async (termino = '') => {
        loading.value = true;
        error.value = null;

        try {
            const query = termino.trim();

            // Caso 1: Búsqueda vacía -> Cargar todas
            if (query === '') {
                const data = await getAllGoodsReceipts();
                mercancias.value = Array.isArray(data) ? data : [];
                return;
            }

            // Caso 2: Es un ID numérico corto (Búsqueda por ID)
            if (/^\d+$/.test(query) && query.length < 6) {
                const data = await getGoodsReceiptById(Number(query));
                mercancias.value = data ? [data] : [];
            }
            // Caso 3: Empieza por GR o es largo (Búsqueda por número de recepción)
            else if (query.toLowerCase().startsWith('gr') || query.length >= 8) {
                const data = await getGoodsReceiptByNumber(query);
                mercancias.value = data ? [data] : [];
            }
            // Caso 4: Otros casos (Puedes añadir búsqueda por proveedor aquí si tu API lo soporta)
            else {
                // Aquí corregí un error: antes llamabas a useSearchMercancia() dentro de sí mismo (recursión infinita)
                const data = await getAllGoodsReceipts(); 
                // Filtro local simple si la API no tiene buscador por texto general
                mercancias.value = data.filter(m => 
                    m.notes?.toLowerCase().includes(query.toLowerCase()) ||
                    m.orderId?.toString().includes(query)
                );
            }
        } catch (err) {
            // Manejo de errores consistente
            if (err.response?.status === 401) {
                authStore.logout();
            }
            error.value = err.response?.data?.message || "Error al buscar mercancías";
            mercancias.value = [];
        } finally {
            loading.value = false;
        }
    };

    // Inicialización
    onMounted(() => obtenerMercancias());

    // Observador para búsqueda en tiempo real
    watch(searchQuery, (nuevoValor) => {
        const val = nuevoValor.trim();
        // Dispara búsqueda si hay 3 caracteres, si es número o si se limpia el campo
        if (val.length >= 3 || /^\d+$/.test(val) || val.length === 0) {
            obtenerMercancias(val);
        }
    });

    return {
        searchQuery,
        mercancias,
        loading,
        error,
        obtenerMercancias
    };
}