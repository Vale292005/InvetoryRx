import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.store.js';
import {
    getAllGoodsReceipts,
    getGoodsReceiptById,
    getGoodsReceiptByNumber
} from '@/api/bodega.js';

export function useSearchMercancia() {
    const authStore = useAuthStore();
    
    const searchQuery = ref('');
    const mercancias = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // --- NUEVA FUNCIÓN: setMercancia ---
    // Permite actualizar el estado de las mercancías manualmente (ej: tras crear una)
    const setMercanciaData = (nuevasMercancias) => {
        mercancias.value = Array.isArray(nuevasMercancias) 
            ? nuevasMercancias 
            : [nuevasMercancias];
    };

    const obtenerMercancias = async (termino = '') => {
        loading.value = true;
        error.value = null;

        try {
            const query = termino.trim();

            if (query === '') {
                const data = await getAllGoodsReceipts();
                // Usamos la nueva función internamente para mantener consistencia
                setMercanciaData(data);
                return;
            }

            if (/^\d+$/.test(query) && query.length < 6) {
                const data = await getGoodsReceiptById(Number(query));
                setMercanciaData(data ? [data] : []);
            }
            else if (query.toLowerCase().startsWith('gr') || query.length >= 8) {
                const data = await getGoodsReceiptByNumber(query);
                setMercanciaData(data ? [data] : []);
            }
            else {
                const data = await getAllGoodsReceipts(); 
                const filtrados = data.filter(m => 
                    m.notes?.toLowerCase().includes(query.toLowerCase()) ||
                    m.orderId?.toString().includes(query)
                );
                setMercanciaData(filtrados);
            }
        } catch (err) {
            if (err.response?.status === 401) {
                authStore.logout();
            }
            error.value = err.response?.data?.message || "Error al buscar mercancías";
            setMercanciaData([]);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => obtenerMercancias());

    watch(searchQuery, (nuevoValor) => {
        const val = nuevoValor.trim();
        if (val.length >= 3 || /^\d+$/.test(val) || val.length === 0) {
            obtenerMercancias(val);
        }
    });

    return {
        searchQuery,
        mercancias,
        loading,
        error,
        obtenerMercancias,
        setMercanciaData // <-- Exportado para su uso en componentes
    };
}