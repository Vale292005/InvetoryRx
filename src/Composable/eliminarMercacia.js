import { ref, reactive } from 'vue';
import { deleteGoodsReceipt } from '@/api/bodega.js';
import { useNotification } from './useNotification';

export function deleteGoodsReceiptAPI(id) {
    return deleteGoodsReceipt(id).then(r => r.data);
}

export function useEliminarMercacia() {
    const { notify } = useNotification();

    const idMercancia = ref(null);
    const form = reactive({
        id: '',
        code: '',
        name: '',
        description: '',
        quantity: '',
        supplierId: '',
        orderId: ''
    });

    const loading = ref(false);
    const error = ref(null);

    const setMercanciaData = (mercancia) => {
        idMercancia.value = mercancia.id;
        form.id = mercancia.id;
        form.code = mercancia.code;
        form.name = mercancia.name;
        form.description = mercancia.description;
        form.quantity = mercancia.quantity;
        form.supplierId = mercancia.supplierId;
        form.orderId = mercancia.orderId;
    };

    const eliminarMercancia = async (id) => {
        if (!id) {
            const msg = "ID de mercancía es requerido para eliminar";
            error.value = msg;
            notify(msg, 'error');
            return;
        }
        loading.value = true;
        error.value = null;

        try {
            await deleteGoodsReceiptAPI(id);
            notify("Recepción de mercancía eliminada con éxito", "Success");
            console.log("Recepción de mercancía eliminada");
        } catch (err) {
            error.value = err;
            notify(err || "Error al eliminar recepción de mercancía", "error");
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        eliminarMercancia,
        loading,
        error,
        setMercanciaData,
        idMercancia,
        form
    };
}