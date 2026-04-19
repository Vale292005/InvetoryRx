import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.store.js';
import {
    getAllGoodsReceipts,
    getGoodsReceiptById,
    getGoodsReceiptByNumber
} from '@/api/bodega.js';

export function useSearchMercancia() {

    const normalizarTexto = (texto) => {
        if (!texto) return "";
        return texto
            .toString()
            .toLowerCase()
            .normalize("NFD")          // Separa la letra del acento (ej: 'á' -> 'a' + '´')
            .replace(/[\u0300-\u036f]/g, ""); // Borra los acentos
    };

    const authStore = useAuthStore();

    const searchQuery = ref('');
    const mercancias = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const setMercanciaData = (nuevasMercancias) => {
        // Normalizamos: si es un objeto solo, lo metemos en un array
        const dataParaGuardar = Array.isArray(nuevasMercancias)
            ? nuevasMercancias
            : (nuevasMercancias ? [nuevasMercancias] : []);

        mercancias.value = dataParaGuardar;
        console.log("💾 [Composable] Estado de 'mercancias' actualizado:", mercancias.value);
    };

    const obtenerMercancias = async (termino = '') => {
        loading.value = true;
        error.value = null;
        console.log("📡 [API Search] Buscando término:", `"${termino}"`);

        try {
            const query = termino.trim();
            let resultado;

            if (query === '') {
                // Caso 1: Búsqueda vacía -> Traer todo
                resultado = await getAllGoodsReceipts();
                console.log("📂 [API] Cargando lista completa");
            }
            else if (/^\d+$/.test(query) && query.length < 6) {
                // Caso 2: Es un ID corto -> Buscar por ID
                resultado = await getGoodsReceiptById(Number(query));
                console.log("🆔 [API] Resultado por ID:", resultado);
            }
            else if (query.toLowerCase().startsWith('gr') || query.length >= 8) {
                // Caso 3: Formato de documento -> Buscar por número
                resultado = await getGoodsReceiptByNumber(query);
                console.log("📄 [API] Resultado por número:", resultado);
            }
            else {
                // Caso 4: Texto general -> Filtrado local robusto
                console.log("🧪 [Local Filter] Filtrando texto...");
                const allData = await getAllGoodsReceipts();

                // Normalizamos el término de búsqueda una sola vez
                const busquedaNormalizada = normalizarTexto(query);

                resultado = allData.filter(m => {
                    // Normalizamos los campos donde queremos buscar
                    const notas = normalizarTexto(m.notes || m.description);
                    const numero = normalizarTexto(m.number || m.orderNumber);
                    const orderId = m.orderId?.toString() || "";

                    // Verificamos si el término está incluido en alguno de los campos
                    return notas.includes(busquedaNormalizada) ||
                        numero.includes(busquedaNormalizada) ||
                        orderId.includes(busquedaNormalizada);
                });

                console.log(`✨ [Local Filter] Buscando "${busquedaNormalizada}" en ${allData.length} registros. Encontrados: ${resultado.length}`);
            }

            setMercanciaData(resultado);

        } catch (err) {
            console.error("❌ [API Search] Error:", err);
            if (err.response?.status === 401) {
                authStore.logout();
            }
            error.value = err.response?.data?.message || "Error al buscar mercancías";
            setMercanciaData([]);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        console.log("🚀 [Composable] Montado, cargando datos iniciales...");
        obtenerMercancias();
    });

    // Escuchador del buscador
    watch(searchQuery, (nuevoValor) => {
        console.log("👀 [Watcher] searchQuery cambió a:", nuevoValor);
        const val = nuevoValor.trim();

        // Ejecutamos búsqueda si está vacío (reset) o si cumple criterios
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
        setMercanciaData
    };
}