import { ref, reactive } from 'vue';

export function useEliminarProducto() {
    const idProducto = ref(null);

    // 1. URL dinámica para Render o Localhost
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const form = reactive({
        nombre: '',
        descripcion: '',
        categoria: ''
    });

    const loading = ref(false);
    const error = ref(null);

    const setProductoData = (producto) => {
        idProducto.value = producto.id;
        form.nombre = producto.name;
        form.descripcion = producto.description;
        form.categoria = producto.category;
    };

    const deleteProduct = async () => {
        // 2. Lanzamos error si no hay ID para detener el alert del componente
        if (!idProducto.value) {
            const msg = "Seleccione un producto para eliminar";
            error.value = msg;
            throw new Error(msg);
        }

        loading.value = true;
        error.value = null;

        try {
            // 3. Uso de la variable BASE_URL
            const response = await fetch(`${BASE_URL}/api/products/${idProducto.value}`, {
                method: 'DELETE',
                headers: {
                    // Si implementas seguridad, añade el token aquí:
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                // Manejo del 401 Unauthorized
                if (response.status === 401) throw new Error("No tienes permiso para eliminar este producto.");

                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'No se pudo eliminar el producto');
            }

            // Limpiamos el formulario tras eliminar con éxito
            idProducto.value = null;
            form.nombre = '';
            form.descripcion = '';
            form.categoria = '';

            return true;
        } catch (err) {
            error.value = err.message;
            throw err; // Crucial para el try/catch del componente Vue
        } finally {
            loading.value = false;
        }
    };

    return { form, loading, error, deleteProduct, setProductoData, idProducto };
}