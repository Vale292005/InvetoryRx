<script setup>
import { useCrearMercancia } from "@/Composable/useCrearMercancia.js";
import { searchProductos } from "@/Composable/SearchProductos.js";
import { useOrders } from "@/Composable/useOrders.js";
import { useSearchProveedores } from "@/Composable/useSearchProveedores.js";
import { useNotification } from "../Composable/useNotification";

import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import SearchProduct from "@/components/SearchProduct.vue";
import SearchOrders from "./SearchOrders.vue"; // Componente respetado
import SearchResults from "./SearchResults.vue"; // Componente respetado
import { ref, reactive, onMounted } from "vue";

const { form, loading, error, saveGoodsReceipt, agregarItem, setOrdenSeleccionada } = useCrearMercancia();
const { orders, getAll: fetchOrders, loading: loadingOrders } = useOrders();
const { searchQuery, productos, cargando } = searchProductos();
const { searchQuery: searchQueryProveedores, proveedores } = useSearchProveedores();

const { notify } = useNotification();

const tempItem = reactive({
    idReal: null,
    productName: '',
    productCode: '',
    receivedQuantity: 1,
    orderedQuantity: 1 // <-- Nuevo estado para la cantidad pedida
});

onMounted(() => { fetchOrders(); });

const seleccionarOrden = (orden) => { setOrdenSeleccionada(orden); };

const seleccionarProveedor = (prov) => {
    form.supplierId = prov.id;
};

const seleccionarDesdeBusqueda = (prod) => {
    tempItem.idReal = prod.id;
    tempItem.productName = prod.name;
    tempItem.productCode = prod.code;
    tempItem.receivedQuantity = 1;
    tempItem.orderedQuantity = 1; // Inicializamos en 1
};

const handleAñadirALista = () => {
    if (!tempItem.idReal) return;

    agregarItem({
        id: tempItem.idReal,
        code: tempItem.productCode,
        name: tempItem.productName,
        receivedQuantity: tempItem.receivedQuantity,
        orderedQuantity: tempItem.orderedQuantity // <-- Ahora pasa la cantidad del input
    });

    tempItem.idReal = null;
    tempItem.productName = '';
    tempItem.productCode = '';
    tempItem.receivedQuantity = 1;
    tempItem.orderedQuantity = 1;
};

const handleCrear = async () => {
    try {
        await saveGoodsReceipt();
        notify("Mercancía creada exitosamente", "success");
    } catch (e) {
        console.error("Error final:", e);
    }
};
</script>

<template>
    <div class="container-card">
        <div class="container-form">

            <div class="add-product-box">
                <h4 class="sub-title">1. Información de Recepción</h4>

                <CustomInput label="Número de Recibo / Factura" v-model="form.receiptNumber"
                    placeholder="Ej: FAC-2024-001" />
                <CustomInput label="Descripcion" v-model="form.notes"
                    placeholder="Ej: Pedido de antiflamatorios" />

                <div class="separator-mini"></div>

                <label class="label-lite">Seleccionar Orden (Opcional)</label>
                <SearchOrders placeholder="Buscar orden..." :productos="orders" :cargando="loadingOrders"
                    @select="seleccionarOrden" />

                <div v-if="form.orderId" class="info-tag-blue">
                    Orden: <strong>{{ form.orderNumber }}</strong>
                </div>
            </div>

            <div class="add-product-box">
                <h4 class="sub-title">2. Proveedor</h4>
                <SearchResults titulo="Proveedores" placeholder="Buscar proveedor..." :productos="proveedores"
                    v-model:searchQuery="searchQueryProveedores" @select="seleccionarProveedor" />

                <div v-if="form.supplierId" class="info-tag-green">
                    ID Proveedor seleccionado: <strong>{{ form.supplierId }}</strong>
                </div>
            </div>

            <hr class="separator" />

            <div class="add-product-box" :style="{ opacity: form.supplierId ? 1 : 0.5 }">
                <h4 class="sub-title">3. Productos Recibidos</h4>
                <SearchProduct placeholder="Buscar producto..." :productos="productos" :cargando="cargando"
                    v-model:searchQuery="searchQuery" @select="seleccionarDesdeBusqueda" />

                <div v-if="tempItem.idReal" class="selection-confirm">
                    <p>Producto: <strong>{{ tempItem.productName }}</strong></p>

                    <div class="qty-inputs">
                        <CustomInput label="Cant. Pedida (Orden)" type="number"
                            v-model.number="tempItem.orderedQuantity" />
                        <CustomInput label="Cant. Recibida Ahora" type="number"
                            v-model.number="tempItem.receivedQuantity" />
                    </div>

                    <button class="btn-add-item" @click="handleAñadirALista">Confirmar e Incluir</button>
                    <button class="delete-link" @click="tempItem.idReal = null">Cancelar</button>
                </div>
            </div>

            <div class="items-wrapper" v-if="form.items.length > 0">
                <table class="styled-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Pedida</th>
                            <th>Recibida</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in form.items" :key="index">
                            <td>{{ item.productName }}</td>
                            <td>{{ item.orderedQuantity }}</td>
                            <td>{{ item.receivedQuantity }}</td>
                            <td><button @click="form.items.splice(index, 1)" class="delete-link">×</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="container-button">
                <CustomButton :label="loading ? 'Procesando...' : 'Finalizar Recepción'"
                    :disabled="loading || form.items.length === 0 || !form.supplierId || !form.receiptNumber"
                    @click="handleCrear" />
            </div>

            <p v-if="error" class="error-msg">{{ error }}</p>
        </div>
    </div>

    <div class="json-debug">
        <pre>{{ form }}</pre>
    </div>
</template>
<style scoped>
.container-card {
    width: 100%;
    max-width: 325px;
    background: white;
    border-radius: 8px;
}

.container-form {
    display: flex;
    flex-direction: column;
    padding: 16px 24px;
    gap: 15px;
    align-items: center;
}

.add-product-box {
    width: 100%;
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sub-title {
    margin: 0 0 5px 0;
    color: #666;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: bold;
}

.selection-confirm {
    margin-top: 10px;
    padding: 12px;
    background: #eef9ee;
    border-radius: 6px;
    width: 100%;
    border: 1px solid #c8e6c9;
    box-sizing: border-box;
}

.btn-add-item {
    background: #2e7d32;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    width: 100%;
    font-weight: bold;
}

.items-wrapper {
    width: 100%;
    margin-top: 10px;
}

.styled-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
}

.styled-table th {
    text-align: left;
    padding: 10px;
    border-bottom: 2px solid #eee;
    color: #888;
}

.styled-table td {
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.delete-link {
    background: none;
    border: none;
    color: #d32f2f;
    cursor: pointer;
    font-weight: bold;
}

.separator {
    width: 100%;
    border: 0;
    border-top: 1px solid #eee;
    margin: 5px 0;
}

.error-msg {
    color: #d32f2f;
    font-size: 12px;
    font-weight: bold;
}

.json-debug {
    background: #f4f4f4;
    padding: 15px;
    margin-top: 20px;
    border-radius: 4px;
    font-size: 11px;
    max-height: 200px;
    overflow-y: auto;
}
</style>