import { reactive, ref } from 'vue';
import { createGoodsReceipt } from '@/api/bodega.js';

export function createGoodsReceiptAPI(goodsReceiptData) {
    return createGoodsReceipt(goodsReceiptData).then(r => r.data);
}

export function useCrearMercancia() {
    const getInitialState = () => ({
        receiptNumber: '',      // Nuevo: según tu JSON
        orderId: '',
        orderNumber: '',       // Nuevo: según tu JSON
        supplierId: '',        // Nuevo: según tu JSON
        supplierName: '',      // Nuevo: según tu JSON
        status: 'PENDING',     // Nuevo: según tu JSON
        notes: '',
        expectedDeliveryDate: '', // Nuevo: según tu JSON
        items: []
    });

    const form = reactive(getInitialState());
    const loading = ref(false);
    const error = ref(null);

    const agregarItem = (producto) => {
        // CORRECCIÓN CLAVE: Ahora aceptamos id o productId
        const idParaRevisar = producto.id || producto.productId;

        if (!idParaRevisar) {
            console.error("El producto no tiene ID (se esperaba 'id' o 'productId'):", producto);
            return; 
        }

        form.items.push({
            productId: idParaRevisar,
            productCode: producto.productCode || producto.code || '',
            productName: producto.productName || producto.name || '',
            orderedQuantity: Number(producto.orderedQuantity) || 0,
            receivedQuantity: Number(producto.receivedQuantity) || 0
        });
    };

    const resetForm = () => {
        Object.assign(form, getInitialState());
    };

    const saveGoodsReceipt = async () => {
        if (!form.orderId) {
            error.value = "Falta el ID de la orden";
            return;
        }
        if (form.items.length === 0) {
            error.value = "La lista de productos está vacía";
            return;
        }

        loading.value = true;
        error.value = null;
        
        try {
            const data = await createGoodsReceiptAPI(form);
            resetForm();
            return data;
        } catch (err) {
            // Capturamos el mensaje del backend que vimos antes (Status Cancelled, etc)
            const serverMsg = err.response?.data?.message || "Error en el servidor";
            error.value = serverMsg;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { form, loading, error, agregarItem, saveGoodsReceipt, resetForm };
}