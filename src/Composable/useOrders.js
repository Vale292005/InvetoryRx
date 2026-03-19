import { ref } from 'vue';
import { orderApi } from '@/api/order.api';

export function useOrders() {
    const orders = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // Función principal para cargar datos
    const fetchOrders = async (apiCall) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await apiCall();
            // Axios devuelve los datos en .data
            orders.value = Array.isArray(response.data) ? response.data : [response.data];
            
        } catch (err) {
            // Aquí 'err' ya es el "mensajeAmigable" de tu interceptor
            error.value = err; 
            orders.value = [];
        } finally {
            loading.value = false;
        }
    };

    // Acciones específicas
    const getAll = () => fetchOrders(() => orderApi.getAll());
    
    const getByStatus = (status) => fetchOrders(() => orderApi.getByStatus(status));
    
    const getByCustomerId = (id) => fetchOrders(() => orderApi.getByCustomer(id));

    const cancelOrder = async (id) => {
        try {
            loading.value = true;
            await orderApi.cancel(id);
            // Actualizamos la lista localmente o volvemos a cargar
            orders.value = orders.value.map(o => 
                o.id === id ? { ...o, status: 'CANCELLED' } : o
            );
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
    };
    const fetchByDateRange = (start, end) => 
    fetchOrders(() => orderApi.searchByDateRange(start, end));

    return {
        orders,
        loading,
        error,
        getAll,
        getByStatus,
        getByCustomerId,
        cancelOrder,
        fetchByDateRange
    };
}