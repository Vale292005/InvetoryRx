<script setup>
import { useCrearMercancia } from "@/Composable/useCrearMercancia.js";
import { searchProductos } from "@/Composable/SearchProductos.js";
import { useOrders } from "@/Composable/useOrders.js"; // Composable de órdenes
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import SearchProduct from "@/components/SearchProduct.vue";
import { ref, reactive, onMounted } from "vue";

// 1. Lógica de creación y órdenes
const { form, loading, error, saveGoodsReceipt, agregarItem, setOrdenSeleccionada } = useCrearMercancia();
const { orders, getAll: fetchOrders, loading: loadingOrders } = useOrders();

// 2. Lógica de búsqueda de productos
const { searchQuery, productos, cargando } = searchProductos();

// Estado temporal para el producto que se está configurando antes de añadir a la lista
const tempItem = reactive({
    idReal: null,
    productName: '',
    productCode: '',
    receivedQuantity: 1
});

onMounted(() => {
    fetchOrders(); // Carga las órdenes disponibles al montar el componente
});

// Función cuando el usuario selecciona una ORDEN
const seleccionarOrden = (orden) => {
    setOrdenSeleccionada(orden);
};

// Función cuando el usuario selecciona un PRODUCTO
const seleccionarDesdeBusqueda = (prod) => {
    tempItem.idReal = prod.id;
    tempItem.productName = prod.name;
    tempItem.productCode = prod.code;
    tempItem.receivedQuantity = 1;
};

const handleAñadirALista = () => {
    if (!tempItem.idReal) return;
    
    try {
        agregarItem({
            id: tempItem.idReal, 
            code: tempItem.productCode,
            name: tempItem.productName,
            receivedQuantity: tempItem.receivedQuantity
        });

        // Limpiar selección temporal
        tempItem.idReal = null;
        tempItem.productName = '';
        tempItem.productCode = '';
        tempItem.receivedQuantity = 1;
    } catch (err) {
        console.error("Error al añadir producto:", err);
    }
};

const handleCrear = async () => {
    try {
        await saveGoodsReceipt();
        alert("Recepción creada con éxito");
    } catch (e) {
        console.error("Error final:", e);
    }
};
</script>

<template>
  <div class="container-card">
    <div class="container-form">
      
      <div class="add-product-box">
          <h4 class="sub-title">1. Seleccionar Orden de Compra</h4>
          <SearchProduct 
              placeholder="Buscar orden por número o ID..." 
              :productos="orders" 
              :cargando="loadingOrders"
              @select="seleccionarOrden" 
          />
          
          <div v-if="form.orderId" class="selection-confirm" style="background: #e3f2fd;">
              <p>Orden activa: <strong>{{ form.orderNumber }}</strong></p>
              <p style="font-size: 11px; color: #666;">ID Proveedor: {{ form.supplierId }}</p>
          </div>
      </div>

      <hr class="separator" />

      <div class="add-product-box" :style="{ opacity: form.orderId ? 1 : 0.5 }">
          <h4 class="sub-title">2. Buscar y Añadir Productos</h4>
          
          <SearchProduct 
              :disabled="!form.orderId"
              placeholder="Buscar por código o nombre..." 
              :productos="productos" 
              :cargando="cargando"
              v-model:searchQuery="searchQuery" 
              @select="seleccionarDesdeBusqueda" 
          />

          <div v-if="tempItem.idReal" class="selection-confirm">
              <p>Vas a recibir: <strong>{{ tempItem.productName }}</strong></p>
              <CustomInput label="Cantidad" type="number" v-model.number="tempItem.receivedQuantity" />
              <button class="btn-add-item" @click="handleAñadirALista">Confirmar e Incluir</button>
              <button class="delete-link" @click="tempItem.idReal = null">Cancelar</button>
          </div>
      </div>

      <div class="items-wrapper" v-if="form.items.length > 0">
          <h4 class="sub-title">Items en esta recepción</h4>
          <table class="styled-table">
              <thead>
                  <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(item, index) in form.items" :key="index">
                      <td>{{ item.productName }}</td>
                      <td>{{ item.receivedQuantity }}</td>
                      <td><button @click="form.items.splice(index, 1)" class="delete-link">×</button></td>
                  </tr>
              </tbody>
          </table>
      </div>

      <div class="container-button">
          <CustomButton
              :label="loading ? 'Enviando...' : 'Finalizar Recepción'"
              :disabled="loading || form.items.length === 0 || !form.orderId"
              @click="handleCrear"
          />
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>

  <div class="json-debug">
      <h4 style="color: #666; font-size: 10px;">DATOS A ENVIAR:</h4>
      <pre>{{ form }}</pre> 
  </div>
</template>

<style scoped>
.container-card { width: 100%; background: white; border-radius: 8px; }
.container-form { display: flex; flex-direction: column; padding: 16px 24px; gap: 15px; align-items: center; }

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

.sub-title { margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold; }

.selection-confirm {
    margin-top: 10px;
    padding: 12px;
    background: #eef9ee;
    border-radius: 6px;
    width: 100%;
    border: 1px solid #c8e6c9;
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

.items-wrapper { width: 100%; margin-top: 10px; }
.styled-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.styled-table th { text-align: left; padding: 10px; border-bottom: 2px solid #eee; color: #888; }
.styled-table td { padding: 10px; border-bottom: 1px solid #eee; }

.delete-link { background: none; border: none; color: #d32f2f; cursor: pointer; font-weight: bold; }
.separator { width: 100%; border: 0; border-top: 1px solid #eee; margin: 5px 0; }
.error-msg { color: #d32f2f; font-size: 12px; font-weight: bold; }

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