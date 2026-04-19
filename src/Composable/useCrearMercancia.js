import { reactive, ref } from 'vue';
import { createGoodsReceipt } from '@/api/bodega.js';

export function createGoodsReceiptAPI(goodsReceiptData) {
    return createGoodsReceipt(goodsReceiptData).then(r => r.data);
}

export function useCrearMercancia() {
    const getInitialState = () => ({
        receiptNumber: "1",           // Requerimiento de usuario
        orderId: 1,                   // Coincide con tu Proxy id: 1
        orderNumber: 'ORD-2024-001',  // Coincide con tu Proxy orderNumber
        supplierId: 1,                // Valor por defecto según tu JSON anterior
        status: "PENDING",
        notes: "Recepción de Farmacia Central",
        items: []
    });

    const form = reactive(getInitialState());
    const loading = ref(false);
    const error = ref(null);

const agregarItem = (producto) => {
        console.log("📦 [Composable] Recibiendo en agregarItem:", producto); // LOG 4

        const idParaRevisar = producto.id || producto.productId;

        if (!idParaRevisar) {
            console.error("🚨 [Critical] No se encontró ID en el objeto recibido:", producto);
            return;
        }

        const newItem = {
            productId: idParaRevisar,       
            productCode: producto.code,   
            productName: producto.name,   
            orderedQuantity: 10,          
            receivedQuantity: Number(producto.receivedQuantity) || 0
        };

        console.log("📝 [Composable] Insertando en form.items:", newItem); // LOG 5
        form.items.push(newItem);
    };

    const resetForm = () => {
        Object.assign(form, getInitialState());
    };

const saveGoodsReceipt = async () => {
        // Log para ver el JSON final exacto antes de viajar por red
        const payload = JSON.parse(JSON.stringify(form));
        console.log("📡 [API] Enviando este JSON al backend:", payload); 

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