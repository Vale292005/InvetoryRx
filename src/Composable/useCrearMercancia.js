import { reactive, ref } from 'vue';
import { createGoodsReceipt } from '@/api/bodega.js';

export function createGoodsReceiptAPI(goodsReceiptData) {
    return createGoodsReceipt(goodsReceiptData).then(r => r.data);
}

export function useCrearMercancia() {
    const getInitialState = () => ({
        receiptNumber: "",           // Ahora vacío para que el usuario o sistema lo asigne
        orderId: null,               // Dinámico
        orderNumber: '',             // Dinámico
        supplierId: null,            // Dinámico
        status: "COMPLETED",       // Por defecto COMPLETED, pero podría ser un dropdown en el futuro
        notes: "",
        items: []
    });

    const form = reactive(getInitialState());

    const setOrdenSeleccionada = (orden) => {
        console.log("📍 [Composable] Seteando orden seleccionada:", orden);
        form.orderId = orden.id;
        form.orderNumber = orden.orderNumber || orden.number;
        form.supplierId = orden.supplierId || orden.supplier_id;
        form.notes = `Recepción basada en orden ${form.orderNumber}`||orden.notes;
    };

    const loading = ref(false);
    const error = ref(null);

    const agregarItem = (producto) => {
        const idParaRevisar = producto.id || producto.productId;
        if (!idParaRevisar) return;

        form.items.push({
            productId: idParaRevisar,
            productCode: producto.code,
            productName: producto.name,
            orderedQuantity: producto.orderedQuantity || 0, // Tomar de la orden si existe
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

    return { form, loading, error, agregarItem, saveGoodsReceipt, resetForm, setOrdenSeleccionada };
}