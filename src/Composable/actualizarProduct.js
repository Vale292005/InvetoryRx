import { ref, reactive } from 'vue';

export function useActualizarProduct() {
    const idProducto = ref(null); // Guardamos el ID para el PUT /id

    const form = reactive({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        minimoStock: 0,
        categoria: ''
    });

    const loading = ref(false);
    const error = ref(null);

    // Esta función servirá para llenar el formulario desde el buscador
    const setProductoData = (producto) => {
        idProducto.value = producto.id;
        form.nombre = producto.name;
        form.descripcion = producto.description;
        form.precio = producto.price;
        form.stock = producto.stock;
        form.minimoStock = producto.minimoStock;
        form.categoria = producto.categoria;
    };

    const updateProduct = async () => {
        if (!idProducto.value) {
            error.value = "No hay un producto seleccionado para actualizar";
            return;
        }

        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(`http://localhost:8080/api/products/${idProducto.value}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar');
            }

            return await response.json();
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { form, loading, error, updateProduct, setProductoData, idProducto };
}