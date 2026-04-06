import { ref, reactive } from 'vue';
// 1. Importamos la función desde tu archivo de API
import { deleteProduct as deleteProductApi } from '@/api/inventory.api';

export function useEliminarProducto() {
    const idProducto = ref(null);

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