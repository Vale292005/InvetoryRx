import { getAllCustomers } from "../api/customer.api";
import { ref, watch, onMounted } from "vue"; 
import {useAuthStore} from "../stores/auth.store";

export function useSearchClientes() {
    const authStore = useAuthStore();
    const searchQuery = ref('');
    const clientes = ref([]);
    const resultado = ref([]);
    const loading = ref(false);

    let timeout = null;

    const obtenerClientes = async (termino = '') => {
        loading.value = true;
        try {
            const token = authStore.token;
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const query = termino.trim();
            const data = await getAllCustomers('');
            clientes.value = data;
            resultado.value = data;

            if (query === 'Activos') {
                resultado.value = clientes.value.filter(c => c.active === true);
            }
            if (query === 'Inactivos') {
                resultado.value = clientes.value.filter(c => c.active === false);
            }
            if (query !== '') {
                resultado.value = clientes.value.filter(c =>
                    c.firstName?.toLowerCase().includes(query.toLowerCase()) ||
                    c.documentNumber?.includes(query)
                );
            }
            else {
                resultado.value = clientes.value;
            }
        } catch (err) {
            console.error(`Error en búsqueda`, err);
            clientes.value = [];
        } finally { loading.value = false; }
    }

    watch(searchQuery, (valor) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            obtenerClientes(valor);
        }, 300);
    });

    onMounted(() => obtenerClientes());

    return {
        searchQuery,
        clientes:resultado,
        loadingSearch:loading,
        obtenerClientes
    };
}