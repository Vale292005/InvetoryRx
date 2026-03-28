import { reactive, ref } from 'vue';
import { createGoodsReceipt } from '@/api/bodega.js';
import { useNotification } from './useNotification';

export function createGoodsReceiptAPI(goodsReceiptData) {
    return createGoodsReceipt(goodsReceiptData).then(r => r.data);}
export function useCrearMercancia() {
    const { notify } = useNotification();
    const getInitialState = () => ({
        id: '',
        code: '',
        name: '',
        description: '',
        quantity: '',
        supplierId: '',
        orderId: ''
    });

    const form = reactive(getInitialState());
    const loading = ref(false);
    const error = ref(null);

    const resetForm = () => {
        Object.assign(form, getInitialState());
    };

    const saveGoodsReceipt = async () => {
        if (!form.code || !form.name || !form.description || !form.quantity || !form.supplierId || !form.orderId) {
            const msg = "Todos los campos son obligatorios";
            error.value = msg;
            notify(msg, 'error');
            return;
        }
        loading.value = true;
        error.value = null;
        
        try {
            const data = await createGoodsReceiptAPI(form);
            notify("Recepción de mercancía creada con éxito", "Success");
            console.log("Recepción de mercancía creada");
            resetForm();
            return data;
        } catch (err) {
            error.value = err;
            notify(err || "Error al crear recepción de mercancía", "error");
            throw err;
        }
        finally {
            loading.value = false;
        }
    };
    return {
        form,
        loading,
        error,
        saveGoodsReceipt,
        resetForm
    };
}