import { reactive, ref } from "vue";
import { useNotification } from "@/Composable/useNotification.js";
import client from "../api/client";

export const register = (userData) => {
    return client.post('/api/auth/register', userData).then(r => r.data);
};

export function useCrearUsuario() {

    const { notify } = useNotification();
    const getInitialState = () => ({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'USER'
    });

    const form = reactive(getInitialState());
    const loading = ref(false);
    const error = ref(null);

    const resetForm = () => {
        Object.assign(form, getInitialState());
    };

    const saveUsuario = async () => {
        if (!form.username || !form.email || !form.firstname || !form.lastname || !form.password) {
            const msg = "Todos los campos son obligatorios";
            error.value = msg;
            notify(msg, 'error');
            return;
        }
        loading.value = true;
        error.value = null;

        try {
            const data = await register(form);
            notify("Usuario creado con exito", "success");
            console.log("Usuario creado");
            resetForm();
            return data;
        } catch (err) {
            error.value = err;
            notify(err || "Error al crear usuario", "error");
            throw err;
        } finally {
            loading.value = false;
        }
    };
    return {
        form,
        loading,
        error,
        saveUsuario,
        resetForm
    };
}