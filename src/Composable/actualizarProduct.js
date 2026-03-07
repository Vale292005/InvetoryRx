import { ref, reactive } from 'vue';
// 1. Importamos la función desde tu archivo de API
import { updateProduct as updateProductApi } from '@/api/inventory.api';

export function useActualizarProduct() {
    const idProducto = ref(null);

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

    // Llena el formulario cuando seleccionas un producto de la lista
    const setProductoData = (producto) => {
        idProducto.value = producto.id;
        // Mapeamos los campos del backend (name) a los del form (nombre)
        form.nombre = producto.name;
        form.descripcion = producto.description;
        form.precio = producto.price;
        form.stock = producto.stock;
        form.minimoStock = producto.minimoStock;
        form.categoria = producto.category; // Ojo: verifica si es .category o .categoria en tu objeto
    };

    const updateProductAction = async () => {
        if (!idProducto.value) {
            const msg = "No hay un producto seleccionado para actualizar";
            error.value = msg;
            throw new Error(msg);
        }

        loading.value = true;
        error.value = null;

        try {
            // 2. Usamos la función centralizada
            // Pasamos el ID y el objeto 'form' completo
            const data = await updateProductApi(idProducto.value, form);

            return data;
        } catch (err) {
            // 3. Capturamos el mensaje amigable de client.js
            error.value = err;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        form,
        loading,
        error,
        updateProduct: updateProductAction,
        setProductoData,
        idProducto
    };
}