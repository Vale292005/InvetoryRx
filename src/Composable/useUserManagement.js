import { reactive, computed } from 'vue';
import axios from 'axios';

// Estado global único (Shared State)
const state = reactive({
    users: [],
    selectedUser: null,
    loading: false,
    error: null
});

// Configuración de Axios usando tu variable de entorno de Vite
// Asegúrate de que en tu .env VITE_API_URL termine en /api o ajusta la ruta abajo
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/users`
});

// Interceptor para inyectar el Token JWT en cada petición
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function useUserManagement() {

    // 1. Obtener todos los usuarios (Métrica 3.3)
    const fetchUsers = async () => {
        state.loading = true;
        state.error = null;
        try {
            const { data } = await api.get('');
            state.users = data;
        } catch (err) {
            state.error = "Error al conectar con el servidor";
            console.error("Fetch Error:", err);
        } finally {
            state.loading = false;
        }
    };

    // 2. Seleccionar usuario (Carga los datos en el Form)
    const selectUser = (userDto) => {
        // Clonamos para que los cambios en el input no afecten la tabla
        // hasta que demos click en "Guardar"
        state.selectedUser = { ...userDto };
    };

    // 3. Guardar nuevo Rol (PATCH /users/{id}/role)
    const updateRole = async () => {
        if (!state.selectedUser) return;
        state.loading = true;
        try {
            await api.patch(`/${state.selectedUser.id}/role`, {
                role: state.selectedUser.role
            });
            await fetchUsers(); // Refrescar la tabla automáticamente
            state.selectedUser = null; // Cerrar el formulario
        } catch (err) {
            state.error = "Error al actualizar el rol";
            console.error("Patch Role Error:", err);
        } finally {
            state.loading = false;
        }
    };

    // 4. Cambiar Estado (Activo/Inactivo)
    const toggleStatus = async (user) => {
        try {
            await api.patch(`/${user.id}/status`, {
                active: !user.active
            });
            await fetchUsers();
        } catch (err) {
            console.error("Error al cambiar estado del usuario");
        }
    };

    // 5. Limpiar selección (Botón cancelar)
    const clearSelection = () => {
        state.selectedUser = null;
    };

    return {
        // Estado Reactivo
        users: computed(() => state.users),
        userForm: computed(() => state.selectedUser),
        isEditing: computed(() => state.selectedUser !== null),
        loading: computed(() => state.loading),
        error: computed(() => state.error),

        // Métodos
        fetchUsers,
        selectUser,
        updateRole,
        toggleStatus,
        clearSelection
    };
}