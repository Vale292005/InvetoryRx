<script setup>
import { useCrearMercancia } from "@/Composable/useCrearMercancia.js";
import { useNotification } from "../Composable/useNotification";
import { searchProductos } from "@/Composable/searchProductos.js"; // Tu buscador
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import SearchProduct from "@/components/SearchProduct.vue";
import { ref, reactive } from "vue";

const { notify } = useNotification();
const { form, loading, error, saveGoodsReceipt, agregarItem } = useCrearMercancia();

// Importamos la lógica de búsqueda de productos
const { searchQuery, productos, cargando } = searchProductos();

// Estado para el producto SELECCIONADO desde el buscador
const tempItem = reactive({
    idReal: null,
    productName: '',
    productCode: '',
    receivedQuantity: 1
});

// Función que se ejecuta cuando el usuario selecciona un producto del buscador
const seleccionarDesdeBusqueda = (prod) => {
    tempItem.idReal = prod.id;
    tempItem.productName = prod.name;
    tempItem.productCode = prod.code;
    notify(`Seleccionado: ${prod.name}`, "info");
};

const handleAñadirALista = () => {
    if (!tempItem.idReal) {
        notify("Primero busca y selecciona un producto", "error");
        return;
    }
    
    // ✅ ENVIAMOS EL ID REAL AL BACKEND
    agregarItem({
        productId: tempItem.idReal, 
        productName: tempItem.productName,
        productCode: tempItem.productCode,
        receivedQuantity: tempItem.receivedQuantity,
        orderedQuantity: tempItem.receivedQuantity
    });

    // Limpiamos
    tempItem.idReal = null;
    tempItem.productName = '';
    tempItem.productCode = '';
    tempItem.receivedQuantity = 1;
};

const handleCrear = async () => {
    try {
        await saveGoodsReceipt();
        notify("Recepción creada con éxito", "success");
    } catch (e) {
        console.error("Error:", e);
    }
};
</script>

<template>
  <div class="container-card">
    <div class="container-form">
      
      <CustomInput label="ID de la Orden" v-model="form.orderId" placeholder="ID de la orden real" />

      <hr class="separator" />

      <div class="add-product-box">
          <h4 class="sub-title">1. Buscar y Seleccionar</h4>
          
          <SearchProduct 
              placeholder="Buscar por código o nombre..." 
              :productos="productos" 
              :cargando="cargando"
              v-model:searchQuery="searchQuery" 
          />

          <div v-if="productos.length > 0 && !tempItem.idReal" class="search-results">
              <div v-for="p in productos" :key="p.id" @click="seleccionarDesdeBusqueda(p)" class="result-item">
                  {{ p.name }} - <small>{{ p.code }}</small>
              </div>
          </div>

          <div v-if="tempItem.idReal" class="selection-confirm">
              <p>Vas a recibir: <strong>{{ tempItem.productName }}</strong></p>
              <CustomInput label="Cantidad" type="number" v-model.number="tempItem.receivedQuantity" />
              <button class="btn-add-item" @click="handleAñadirALista">Confirmar e Incluir</button>
              <button class="delete-link" @click="tempItem.idReal = null">Cancelar</button>
          </div>
      </div>

      <div class="items-wrapper" v-if="form.items.length > 0">
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
              :disabled="loading || form.items.length === 0"
              @click="handleCrear"
          />
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Tus estilos anteriores + estos ajustes */
.search-results {
    background: white;
    border: 1px solid #ddd;
    max-height: 150px;
    overflow-y: auto;
    width: 100%;
}
.result-item {
    padding: 8px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    font-size: 13px;
}
.result-item:hover { background: #f0f0f0; }
.selection-confirm {
    margin-top: 10px;
    padding: 10px;
    background: #eef9ee;
    border-radius: 5px;
    width: 100%;
}
.separator { width: 100%; border-top: 1px solid #eee; margin: 15px 0; }
.container-card { width: 100%; background: white; }
.container-form { display: flex; flex-direction: column; padding: 16px 24px; gap: 10px; align-items: center; }

.add-product-box {
    width: 100%;
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.sub-title { margin: 0; color: #666; font-size: 14px; text-transform: uppercase; }

.btn-add-item {
    background: #444;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 5px;
}

.items-wrapper { width: 100%; margin-top: 15px; }
.styled-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.styled-table th { text-align: left; padding: 8px; border-bottom: 2px solid #eee; }
.styled-table td { padding: 8px; border-bottom: 1px solid #eee; }

.delete-link { background: none; border: none; color: red; cursor: pointer; font-size: 11px; }
.separator { width: 100%; border: 0; border-top: 1px solid #eee; margin: 10px 0; }
.error-msg { color: red; font-size: 12px; }
</style>