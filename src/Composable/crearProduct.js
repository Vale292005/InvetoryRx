import { ref, reactive } from 'vue';
// 1. Importamos la función desde tu archivo de API
import { createProduct as createProductApi } from '@/api/inventory.api';

export function crearProduct() {
    const getInitialState = () => ({
        code: '',        // Campo obligatorio según el test (existsByCode)
        name: '',        // En lugar de 'nombre'
        description: '', // En lugar de 'descripcion'
        price: 0,        // En lugar de 'precio'
        stock: 0,
        minStock: 0,     // En lugar de 'minimoStock'
        category: '',    // En lugar de 'categoria'
        active: true     // El test espera que sea true
    });

    const form = reactive(getInitialState());
    const loading = ref(false);
    const error = ref(null);

    const resetForm = () => {
        Object.assign(form, getInitialState());
    };

    const saveProduct = async () => {
        // Validación básica
        if (!form.name || !form.price || !form.code) {
            const msg = "El nombre, el precio y el código son obligatorios";
            error.value = msg;
            throw new Error(msg);
        }

        loading.value = true;
        error.value = null;

        try {
            // 2. Usamos la función de tu archivo centralizado
            // Pasamos 'form' directamente (Axios se encarga del JSON.stringify)
            const data = await createProductApi(form);

            // 3. Si todo sale bien, limpiamos
            resetForm();
            return data;

        } catch (err) {
            // 4. Capturamos el error amigable que configuramos en client.js
            // Si err es un string (por tu Promise.reject), lo usamos directamente
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
        saveProduct,
        resetForm
    };
}