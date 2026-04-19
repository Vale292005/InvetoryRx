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
    console.log("📡 [API Search] Iniciando búsqueda con término:", termino);

    try {
        const query = termino.trim();
        let data;

        if (query === '') {
            data = await getAllGoodsReceipts();
            console.log("📂 [API Search] getAllGoodsReceipts respondió:", data);
        } else if (/^\d+$/.test(query) && query.length < 6) {
            data = await getGoodsReceiptById(Number(query));
            console.log("🆔 [API Search] getById respondió:", data);
            data = data ? [data] : [];
        } else {
            // ... (resto de la lógica)
            data = await getAllGoodsReceipts();
            // log para ver qué hay antes de filtrar
            console.log("🧪 [API Search] Filtrando sobre:", data);
        }

        // MUY IMPORTANTE: Ver qué llega a setMercanciaData
        setMercanciaData(data);
        
    } catch (err) {
        console.error("❌ [API Search] Error fatal:", err.response?.data || err.message);
        error.value = "Error al buscar";
    } finally {
        loading.value = false;
        console.log("🏁 [API Search] Estado final de 'mercancias':", mercancias.value);
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