import { ref, reactive } from 'vue';

export function crearProduct() {
    // 1. URL dinámica para detectar si estamos en Render o en Localhost
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const getInitialState = () => ({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        minimoStock: 0,
        categoria: ''
    });

    const form = reactive(getInitialState());
    const loading = ref(false);
    const error = ref(null);

    const resetForm = () => {
        Object.assign(form, getInitialState());
    };

    const saveProduct = async () => {
        // Validación básica antes de enviar
        if (!form.nombre || !form.precio) {
            const msg = "El nombre y el precio son obligatorios";
            error.value = msg;
            throw new Error(msg);
        }

        loading.value = true;
        error.value = null;

        try {
            // 2. Usamos la BASE_URL configurada
            const response = await fetch(`${BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // Si el backend pide token, descomenta la siguiente línea:
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                // Manejo de error 401 si no hay permisos
                if (response.status === 401) throw new Error("No tienes permiso para crear productos.");

                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al guardar el producto');
            }

            const data = await response.json();
            resetForm();
            return data;

        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        form,
        loading,
        error,
        saveProduct,
        resetForm
    };
}