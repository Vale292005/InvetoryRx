import { reactive, ref } from 'vue';
import { createGoodsReceipt } from '@/api/bodega.js';
import { useNotification } from './useNotification';

export function createGoodsReceiptAPI(goodsReceiptData) {
    // Enviamos el objeto tal cual lo espera el test de Java
    return createGoodsReceipt(goodsReceiptData).then(r => r.data);
}

export function useCrearMercancia() {
    const { notify } = useNotification();

    // Estado inicial basado en GoodsReceipt.java y el Test
    const getInitialState = () => ({
        orderId: '',      // ID de la orden de compra
        notes: '',        // Notas generales (Test: .notes("Test create"))
        items: []         // Arreglo de GoodsReceiptItem
    });

    const form = reactive(getInitialState());
    
    // Estado para el ítem que se está escribiendo actualmente (opcional pero recomendado)
    const itemActual = reactive({
        productId: '',
        productCode: '',
        productName: '',
        orderedQuantity: 0,
        receivedQuantity: 0
    });

    const loading = ref(false);
    const error = ref(null);

    // Función para agregar un producto a la lista antes de enviar
    const agregarItem = (producto) => {
        form.items.push({
            productId: producto.id,
            productCode: producto.code,
            productName: producto.name,
            orderedQuantity: producto.orderedQuantity || 0,
            receivedQuantity: producto.receivedQuantity || 0
        });
    };

    const resetForm = () => {
        Object.assign(form, getInitialState());
    };

    const saveGoodsReceipt = async () => {
        // Validación basada en la estructura del Test
        if (!form.orderId || form.items.length === 0) {
            const msg = "Se requiere el ID de orden y al menos un producto";
            error.value = msg;
            notify(msg, 'error');
            return;
        }

        loading.value = true;
        error.value = null;
        
        try {
            // El objeto 'form' ahora tiene: { orderId, notes, items: [...] }
            const data = await createGoodsReceiptAPI(form);
            notify("Recepción de mercancía creada con éxito", "success");
            resetForm();
            return data;
        } catch (err) {
            const serverMsg = err.response?.data?.message || "Error al crear recepción";
            error.value = serverMsg;
            notify(serverMsg, "error");
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        form,
        itemActual, // Para vincular a los inputs de un producto
        loading,
        error,
        agregarItem,
        saveGoodsReceipt,
        resetForm
    };
}