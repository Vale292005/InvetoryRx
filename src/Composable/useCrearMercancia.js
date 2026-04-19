import { reactive, ref } from 'vue';
import { createGoodsReceipt } from '@/api/bodega.js';

export function createGoodsReceiptAPI(goodsReceiptData) {
    return createGoodsReceipt(goodsReceiptData).then(r => r.data);
}

export function useCrearMercancia() {

    const getInitialState = () => ({
        orderId: '',
        notes: '',
        items: []
    });

    const form = reactive(getInitialState());
    const loading = ref(false);
    const error = ref(null);

    const agregarItem = (producto) => {
        // Validación interna para evitar objetos vacíos
        if (!producto.id) {
            console.error("El producto no tiene ID:", producto);
            return; 
        }

        form.items.push({
            productId: producto.id,
            productCode: producto.code || '',
            productName: producto.name || '',
            orderedQuantity: Number(producto.orderedQuantity) || 0,
            receivedQuantity: Number(producto.receivedQuantity) || 0
        });
        
    };

    const resetForm = () => {
        form.orderId = '';
        form.notes = '';
        form.items = [];
    };

    const saveGoodsReceipt = async () => {
        if (!form.orderId) {
            const msg = "Falta el ID de la orden";
            return;
        }
        if (form.items.length === 0) {
            const msg = "La lista de productos está vacía";
            return;
        }

        loading.value = true;
        error.value = null;
        
        try {
            const data = await createGoodsReceiptAPI(form);
            resetForm();
            return data;
        } catch (err) {
            const serverMsg = err.response?.data?.message || "Error en el servidor";
            error.value = serverMsg;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { form, loading, error, agregarItem, saveGoodsReceipt, resetForm };
}