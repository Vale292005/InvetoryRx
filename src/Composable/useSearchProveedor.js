import { getAllSuppliers } from "../api/proveedor";

export function useSearchProveedor() {
    const authStore = useAuthStore();
    const searchQuery = ref('');
    const proveedores = ref([]);
    const resultado = ref([]);
    const loading = ref(false);

    let timeout = null;

    const obtenerProveedores = async (termino = '') => {
        loading.value=true;
        try {
            const token = authStore.token;
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const query = termino.trim();
            const data = await getAllSuppliers('');
            proveedores.value = data;
            resultado.value = data;
            if(query === 'Activos'){
                resultado.value = proveedores.value.filter(c=>c.active === true);
            }
            if(query === 'Inactivos'){
                resultado.value = proveedores.value.filter(c=>c.active === false);
            }
            if (query !== '') {
                resultado.value = proveedores.value.filter(c =>
                    c.name?.toLowerCase().includes(query.toLowerCase()) ||
                    c.email?.includes(query)
                );
            }
            else {
                resultado.value = proveedores.value;
            }
        } catch (err) {
            console.error(`Error en busqueda`, err);
            proveedores.value = [];
        } finally { loading.value = false; }
    }

    watch(searchQuery,(valor)=>{
        clearTimeout(timeout);
        timeout=setTimeout(()=>{
            obtenerProveedores(valor);
        },300);
    });

    onMounted(()=>obtenerProveedores());

    return{
        searchQuery,
        proveedores:resultado,
        loading,
        obtenerProveedores
    };

}