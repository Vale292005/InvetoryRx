import { ref, watch, onMounted } from 'vue';
import { getAllSuppliers } from '../api/proveedor';
import { useAuthStore } from '../stores/auth.store';

export function useSearchProveedores() {
    const authStore = useAuthStore();

    const searchQuery = ref('');
    const listaCompleta = ref([]); // Todos los proveedores de la DB
    const resultadosFiltrados = ref([]); // Lo que se muestra en pantalla
    const loading = ref(false);

    // 1. Cargar datos una sola vez
    const cargarDatos = async () => {
        loading.value = true;
        try {
            // Asumiendo que getAllSuppliers ya maneja el token internamente o mediante interceptores
            const data = await getAllSuppliers();
            listaCompleta.value = data;
            resultadosFiltrados.value = data;
        } catch (err) {
            console.error("Error al cargar proveedores:", err);
            listaCompleta.value = [];
        } finally {
            loading.value = false;
        }
    };

    // 2. Filtrar localmente (Más rápido, sin peticiones de red adicionales)
    const filtrarProveedores = (termino) => {
        const query = termino.trim().toLowerCase();
        if (!query) {
            resultadosFiltrados.value = listaCompleta.value;
            return;
        }

        resultadosFiltrados.value = listaCompleta.value.filter(p =>
            p.name?.toLowerCase().includes(query) ||
            p.code?.includes(query) // Usamos 'code' que es lo que manejas en el form
        );
    };

    // Escuchar cambios en la búsqueda
    watch(searchQuery, (nuevoValor) => {
        filtrarProveedores(nuevoValor);
    });

    onMounted(cargarDatos);

    return {
        searchQuery,
        proveedores: resultadosFiltrados, // Esto es lo que consume SearchResults
        loading,
        refrescar: cargarDatos
    };
}