import { ref, reactive } from 'vue';
import { useNotification } from "@/Composable/useNotification.js";
import client from "../api/client";

/**
 * Servicios de API centralizados
 */
export const findUserByUsername = (username) => {
    return client.get(`/users/search/${username}`).then(r => r.data);
};

export const updateUserApi = (id, userData) => {
    return client.put(`/users/${id}`, userData).then(r => r.data);
};

/**
 * Composable para Buscar y Actualizar Usuario
 */
export function useUpdateUser() {
    const { notify } = useNotification();
    
    const idUsuario = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const form = reactive({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        role: 'USER'
    });

    // 1. Función para rellenar el formulario (El "Buscador")
    const searchAndFill = async (usernameToSearch) => {
        if (!usernameToSearch) return;
        
        loading.value = true;
        error.value = null;

        try {
            const user = await findUserByUsername(usernameToSearch);
            
            // Rellenamos los datos reactivos
            idUsuario.value = user.id;
            form.username = user.username;
            form.email = user.email;
            form.firstname = user.firstname;
            form.lastname = user.lastname;
            form.role = user.role;

            notify("Usuario encontrado", "success");
            return user;
        } catch (err) {
            const msg = err.response?.data?.message || "Usuario no encontrado";
            error.value = msg;
            notify(msg, "error");
            // Limpiamos el form si no lo encuentra
            idUsuario.value = null;
        } finally {
            loading.value = false;
        }
    };

    // 2. Acción de actualizar los datos modificados
    const updateUserAction = async () => {
        if (!idUsuario.value) {
            const msg = "Primero debes buscar y seleccionar un usuario";
            notify(msg, "error");
            return;
        }

        loading.value = true;
        error.value = null;

        try {
            const data = await updateUserApi(idUsuario.value, form);
            notify("Datos actualizados correctamente", "success");
            return data;
        } catch (err) {
            error.value = err.response?.data?.message || "Error al actualizar";
            notify(error.value, "error");
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        form,
        loading,
        error,
        idUsuario,
        searchAndFill, // Usa esta en tu input de búsqueda
        updateUser: updateUserAction
    };
}