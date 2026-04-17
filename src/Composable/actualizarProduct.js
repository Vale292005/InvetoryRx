import { ref, reactive } from 'vue';
// 1. Importamos la función desde tu archivo de API
import { updateProduct as updateProductApi } from '@/api/inventory.api';

export function useActualizarProduct() {
    const idProducto = ref(null);

    const form = reactive({
        code: '',         // ¡Importante! El test usa "MED001"
        name: '',         // Antes era nombre
        description: '',  // Antes era descripcion
        price: 0,         // Antes era precio
        stock: 0,
        minStock: 0,      // Antes era minimoStock
        category: '',     // Antes era categoria
        active: true      // El test de actualización lo incluye
    });

    const loading = ref(false);
    const error = ref(null);

    // Llena el formulario cuando seleccionas un producto de la lista
    const setProductoData = (producto) => {
        form.code = producto.code || producto.codigo || '';
        form.name = producto.name || producto.nombre || '';
        form.description = producto.description || producto.descripcion || '';
        form.price = producto.price || producto.precio || 0;
        form.stock = producto.stock || 0;
        form.minStock = producto.minStock || producto.minimoStock || 0;
        form.category = producto.category || producto.categoria || '';
        form.active = producto.active !== undefined ? producto.active : true;
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