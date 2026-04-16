import { ref, reactive } from 'vue';
// 1. Importamos la función desde tu archivo de API
import { deleteProduct as deleteProductApi } from '@/api/inventory.api';

export function useEliminarProducto() {
    const idProducto = ref(null);

    const form = reactive({
        code: '',            // Obligatorio (ej: "MED001")
        name: '',            // Obligatorio (ej: "Loratadina 10mg")
        description: '',     // Opcional (pero recomendada)
        price: 0,            // Obligatorio (Número/Decimal)
        stock: 0,            // Obligatorio (Número entero)
        minStock: 0,         // Obligatorio (Número entero)
        category: '',        // Obligatorio (Debe coincidir con el Enum)
        active: true
    });

    const loading = ref(false);
    const error = ref(null);

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

    const eliminarProductoAction = async () => {
        // Validación básica antes de llamar a la API
        if (!idProducto.value) {
            const msg = "Seleccione un producto para eliminar";
            error.value = msg;
            throw new Error(msg);
        }

        loading.value = true;
        error.value = null;

        try {
            await deleteProductApi(idProducto.value);
            resetForm();

            return true;
        } catch (err) {
            // Manejamos errores de Axios/Client
            error.value = err.response?.data?.message || err.message || 'Error al eliminar';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const resetForm = () => {
        idProducto.value = null;
        form.nombre = '';
        form.descripcion = '';
        form.categoria = '';
    };

    return {
        form,
        loading,
        error,
        deleteProduct: eliminarProductoAction, // Mantenemos el nombre para el componente
        setProductoData,
        idProducto
    };
}