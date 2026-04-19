import { ref } from 'vue';
import { deleteGoodsReceipt } from '@/api/bodega.js';
import { useNotification } from './useNotification';

/**
 * Función pura para llamar a la API
 */
export function deleteGoodsReceiptAPI(id) {
    return deleteGoodsReceipt(id).then(r => r.data);
}

export function useEliminarMercancia() {
    const { notify } = useNotification();

    // Estado
    const loading = ref(false);
    const error = ref(null);
    
    // Solo necesitamos trackear el ID que se pretende eliminar
    const idMercancia = ref(null);

    /**
     * Prepara el ID para la eliminación (útil para modales de confirmación)
     */
    const setMercanciaParaEliminar = (id) => {
        idMercancia.value = id;
    };

    /**
     * Ejecuta la eliminación en el servidor
     */
    const eliminarMercancia = async (idExterno = null) => {
        // Usamos el ID pasado por argumento o el que tengamos guardado en el estado
        const idAEliminar = idExterno || idMercancia.value;

        if (!idAEliminar) {
            const msg = "No se ha seleccionado ninguna recepción para eliminar";
            error.value = msg;
            notify(msg, 'error');
            return;
        }

        loading.value = true;
        error.value = null;

        try {
            await deleteGoodsReceiptAPI(idAEliminar);
            notify("Recepción de mercancía eliminada con éxito", "success");
            
            // Limpiamos el estado después de éxito
            if (idMercancia.value === idAEliminar) idMercancia.value = null;
            
            return true; 
        } catch (err) {
            // Manejo de errores consistente con el de Crear
            const serverMsg = err.response?.data?.message || "Error al eliminar la recepción";
            error.value = serverMsg;
            notify(serverMsg, "error");
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        idMercancia,
        loading,
        error,
        setMercanciaParaEliminar,
        eliminarMercancia
    };
}