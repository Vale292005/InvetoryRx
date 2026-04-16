import { ref, reactive } from 'vue';

export function useToggleStatus() {
    const idProducto = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // 1. Usamos la variable de entorno configurada en Render (VITE_API_URL)
    // Si no existe (en local), usará localhost por defecto.
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const form = reactive({
        code: '',         // Código interno (ej: 'MED001') - Usado en existsByCode
        name: '',         // Nombre del producto - Antes tenías 'nombre'
        description: '',  // Descripción - Antes tenías 'descripcion'
        price: 0,         // Precio - Antes tenías 'precio' (BigDecimal en Java)
        stock: 0,         // Cantidad actual en inventario
        minStock: 0,      // Stock mínimo - Antes tenías 'minimoStock'
        category: '',     // Categoría - Antes tenías 'categoria' (ej: 'Medicamentos')
        active: true      // Estado - Usado para el toggle y filtros de búsqueda
    });

    const setProductoData = (producto) => {
        idProducto.value = producto.id; // Asegúrate de que el producto tenga un ID
        form.code = producto.code || '';
        form.name = producto.name || '';
        form.description = producto.description || '';
        form.price = producto.price || 0;
        form.stock = producto.stock || 0;
        form.minStock = producto.minStock || 0;
        form.category = producto.category || '';
        form.active = producto.active !== undefined ? producto.active : true;
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