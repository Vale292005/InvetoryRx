import { onMounted, watch, ref } from "vue";
import { getUsers } from "../api/user";
import { useAuthStore } from "../stores/auth.store";

export function useSearchUsuarios() {
    const authStore = useAuthStore;
    const searchQuery = ref('');
    const usuarios = ref([]);
    const resultado = ref([]);
    const loading = ref(false);

    let timeout = null;

    const obtenerUsuarios = async (termino = '') => {
        loading.value(true);
        try {
            const token = authStore.token;
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const query = termino.trim();
            const data = await getUsers('');
            usuarios.value = data;
            resultado.value = data;

            if (query === 'Activos') {
                resultado.value = usuarios.value.filter(c => c.active === true);
            }
            if (query === 'Inactivos') {
                resultado.value = usuarios.value.filter(c => c.active === false);
            }
            if (query !== '') {
                resultado.value = usuarios.value.filter(c =>
                    c.firstName?.toLowerCase().includes(query.toLowerCase()) ||
                    c.documentNumber?.includes(query)
                );
            }
            else {
                resultado.value = usuarios.value;
            }
        } catch (err) {
            console.error(`Error en busqueda`, err);
            usuarios.value = [];
        } finally { loadign.value = true; }
    }

    watch(searchQuery,(valor)=>{
        clearTimeout(timeout);
        timeout=setTimeout(()=>{
            obtenerUsuarios(valor);
        },300);
    });

    onMounted(()=>obtenerUsuarios());

    return{
        searchQuery,
        usuarios:resultado,
        loading,
        obtenerUsuarios
    };
}