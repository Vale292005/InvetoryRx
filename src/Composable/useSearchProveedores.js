import { ref, watch, onMounted } from 'vue';
import { getAllSuppliers } from '../api/proveedor';
import { useAuthStore } from '../stores/auth.store';

export function useSearchProveedores() {
    const authStore = useAuthStore();

    const searchQuery = ref('');
    const proveedores = ref([]);
    const loading = ref(false);
    const resultados = ref([]);

    let timeout = null;

    const obtenerProveedores = async (termino = '') => {
        loading.value = true;
        try {
            const token = authStore.token;
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const query = termino.trim();
            const data = await getAllSuppliers();
            proveedores.value = data;
            resultados.value = data;

            if (query !== '') {
                resultados.value = proveedores.value.filter(c =>
                    c.name?.toLowerCase().includes(query.toLowerCase()) ||
                    c.documentNumber?.includes(query)
                );
            }
            else {
                resultados.value = proveedores.value;
            }
        } catch (err) {
            console.error(`Error en busqueda`, err);
            proveedores.value = [];
        } finally { loading.value = false; }
    }

    watch(searchQuery, (valor) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            obtenerProveedores(valor);
        }, 300);
    });

    onMounted(() => obtenerProveedores());

    return {
        searchQuery,
        proveedores: resultados,
        loading,
        obtenerProveedores
    };
}
