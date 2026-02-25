import { ref, reactive } from 'vue';

export function useToggleStatus() {
    const idProducto = ref(null);
    const loading = ref(false);
    const error = ref(null);

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
        if (!idProducto.value) {
            error.value = "No hay un producto seleccionado";
            return;
        }

        loading.value = true;
        error.value = null;

        try {
            // PATCH /api/products/{id}/toggle-status
            const response = await fetch(`http://localhost:8080/api/products/${idProducto.value}/toggle-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
                // Normalmente PATCH toggle no requiere body, se maneja por URL
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al cambiar el estado');
            }

            return await response.json();
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { form, loading, error, toggleStatus, setProductoData, idProducto };
}