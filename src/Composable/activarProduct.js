import { ref, reactive } from 'vue';

export function useToggleStatus() {
    const idProducto = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // 1. Usamos la variable de entorno configurada en Render (VITE_API_URL)
    // Si no existe (en local), usará localhost por defecto.
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const form = reactive({
        nombre: '',
        descripcion: '',
    });

    const setProductoData = (producto) => {
        idProducto.value = producto.id;
        form.nombre = producto.name;
        form.descripcion = producto.description;
    };

    const toggleStatus = async () => {
        // 2. IMPORTANTE: Lanzamos error si no hay ID.
        // Esto evita que el handleActivar del componente siga ejecutando el 'alert' de éxito.
        if (!idProducto.value) {
            const msg = "Seleccione un producto primero";
            error.value = msg;
            throw new Error(msg);
        }

        loading.value = true;
        error.value = null;

        try {
            // 3. Construimos la URL usando la BASE_URL dinámica
            const response = await fetch(`${BASE_URL}/products/${idProducto.value}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Si ya manejas tokens, aquí deberías añadir:
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // 4. Manejo de errores de respuesta (incluyendo el 401 Unauthorized)
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("No tienes autorización para realizar esta acción.");
                }

                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al cambiar el estado del producto');
            }

            return await response.json();
        } catch (err) {
            // Guardamos el mensaje para mostrarlo en el <p v-if="error"> del template
            error.value = err.message;
            // Re-lanzamos para que el catch del componente (handleActivar) lo atrape
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { form, loading, error, toggleStatus, setProductoData, idProducto };
}