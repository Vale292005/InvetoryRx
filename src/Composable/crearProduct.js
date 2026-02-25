import { ref, reactive } from 'vue';

export function crearProduct() {
    // Definimos una función que devuelva un objeto nuevo cada vez
    const getInitialState = () => ({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        minimoStock: 0,
        categoria: ''
    });

    // Inicializamos con una copia limpia
    const form = reactive(getInitialState());
    const loading = ref(false);
    const error = ref(null);

    // Función para resetear el formulario correctamente
    const resetForm = () => {
        Object.assign(form, getInitialState());
    };

    // Función para enviar al Backend (@PostMapping)
    const saveProduct = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch('http://localhost:8080/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            // Manejo de errores basado en la respuesta del servidor
            if (!response.ok) {
                // Intentamos parsear el error del back, si no, lanzamos genérico
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al guardar el producto');
            }

            const data = await response.json();
            resetForm(); // Limpiar tras éxito
            return data;

        } catch (err) {
            error.value = err.message;
            throw err; // Re-lanzamos para que el componente pueda reaccionar
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