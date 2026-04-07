// Composable/useNotification.js
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store.js';

export function useNotification() {
    const authStore = useAuthStore();
    const notifications = ref([]);
    const loading = ref(false);

    // Obtenemos el rol reactivo de Pinia
    const userRole = computed(() => authStore.user?.role || 'USER');

    const fetchNotifications = async () => {
        loading.value = true;
        
        // Simulamos un retraso de red de 1 segundo
        await new Promise(resolve => setTimeout(resolve, 1000));

        // DATOS MOCK (Simulando lo que enviaría Spring Boot)
        notifications.value = [
            { 
                id: 1, 
                title: '⚠️ Stock Crítico', 
                message: 'Quedan 2 unidades de Paracetamol 500mg.', 
                actionUrl: '/inventario',
                role: 'WAREHOUSE' // Solo WAREHOUSE y ADMIN deberían ver el botón
            },
            { 
                id: 2, 
                title: '✅ Venta Registrada', 
                message: 'Se ha completado la orden #4502.', 
                actionUrl: '/ventas/4502',
                role: 'SALES' 
            },
            { 
                id: 3, 
                title: '👤 Usuario Nuevo', 
                message: 'El usuario "Vendedor_Bogota" ha sido creado.', 
                actionUrl: '/usuarios',
                role: 'ADMIN' 
            }
        ];

        loading.value = false;
    };

    return {
        notifications,
        loading,
        userRole,
        fetchNotifications
    };
}