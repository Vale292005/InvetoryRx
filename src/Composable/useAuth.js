import { ref } from 'vue';
import { forgotPassword, resetPassword } from '@/api/auth.api.js';
import { useNotification } from './useNotification';

export function useAuthActions() {
    const { notify } = useNotification();
    const loading = ref(false);
    const error = ref(null);

    // 1. Para solicitar el correo
    const sendForgotPassword = async (email) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await forgotPassword({ email });
            notify(res.message, "success");
            return true;
        } catch (err) {
            error.value = err.response?.data?.message || "Error al enviar el correo";
            notify(error.value, "error");
        } finally {
            loading.value = false;
        }
    };

    // 2. Para cambiar la contraseña con el token
    const executeResetPassword = async (token, newPassword) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await resetPassword({ token, newPassword });
            notify(res.message, "success");
            return true;
        } catch (err) {
            error.value = err.response?.data?.message || "Error al restablecer contraseña";
            notify(error.value, "error");
        } finally {
            loading.value = false;
        }
    };

    return { sendForgotPassword, executeResetPassword, loading, error };
}