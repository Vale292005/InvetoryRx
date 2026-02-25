import { ref, reactive } from 'vue';

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

    const deleteProduct = async () => {
        if (!idProducto.value) {
            error.value = "Seleccione un producto para eliminar";
            return;
        }

        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`http://localhost:8080/api/products/${idProducto.value}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('No se pudo eliminar el producto');
            }

            // Limpiamos el formulario tras eliminar
            idProducto.value = null;
            form.nombre = '';
            form.descripcion = '';
            form.categoria = '';

            return true;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { form, loading, error, deleteProduct, setProductoData, idProducto };
}