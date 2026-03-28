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

    const obtenerMercancias = async (termino = '') => {
        try {
            const query = termino.trim();

            if (query === '') {
                mercancias.value = await getAllGoodsReceipts();
                return;
            }

            if (/^\d+$/.test(query) && query.length < 6) {
                const data = await getGoodsReceiptById(query);
                mercancias.value = data ? [data] : [];
            }
            else if (query.toLowerCase().startsWith('gr') || query.length >= 8) {
                const data = await getGoodsReceiptByNumber(query);
                mercancias.value = data ? [data] : [];
            }
            else {
                mercancias.value = await useSearchMercancia(query);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error("Sesión expirada");
                authStore.logout();
            }
            mercancias.value = [];
        }
    };

    onMounted(() => obtenerMercancias());

    watch(searchQuery, (nuevoValor) => {
        const val = nuevoValor.trim();
        if (val.length >= 3 || /^\d+$/.test(val)) {
            obtenerMercancias(val);
        } else if (val.length === 0) {
            obtenerMercancias();
        }
    });

    return {
        searchQuery,
        mercancias,
        obtenerMercancias
    };
}
