<script setup>
import { useCrearMercancia } from "@/Composable/useCrearMercancia.js";
import { useNotification } from "../Composable/useNotification";
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import { ref, reactive } from "vue";

const { notify } = useNotification();
const { form, loading, error, saveGoodsReceipt, agregarItem } = useCrearMercancia();

// Estado temporal para el producto que estás escribiendo antes de añadirlo
const tempItem = reactive({
    productName: '',
    productCode: '',
    receivedQuantity: 1
});

const handleAñadirALista = () => {
    if (!tempItem.productName || !tempItem.productCode) {
        notify("Escribe el nombre y código del producto", "error");
        return;
    }
    
    // Pasamos los datos al composable
    agregarItem({
        id: Date.now(), // ID temporal
        name: tempItem.productName,
        code: tempItem.productCode,
        receivedQuantity: tempItem.receivedQuantity,
        orderedQuantity: tempItem.receivedQuantity // Asumimos que es igual si no hay orden previa
    });

    // Limpiamos los campos para el siguiente producto
    tempItem.productName = '';
    tempItem.productCode = '';
    tempItem.receivedQuantity = 1;
};

const handleCrear = async () => {
    try {
        await saveGoodsReceipt();
        notify("Recepción enviada al servidor", "success");
    } catch (e) {
        console.error("Error detallado:", e);
    }
};
</script>

<template>
  <div class="container-card">
    <div class="container-form">
      
      <CustomInput label="ID de la Orden" v-model="form.orderId" placeholder="Ej: 1" />

      <hr class="separator" />

      <div class="add-product-box">
          <h4 class="sub-title">Añadir Producto</h4>
          <CustomInput label="Nombre del Producto" v-model="tempItem.productName" />
          <CustomInput label="Código" v-model="tempItem.productCode" />
          <CustomInput label="Cantidad" type="number" v-model.number="tempItem.receivedQuantity" />
          
          <button class="btn-add-item" @click="handleAñadirALista">
              Confirmar e Incluir en Lista
          </button>
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
                      <td>{{ item.productName }} ({{ item.productCode }})</td>
                      <td>{{ item.receivedQuantity }}</td>
                      <td><button @click="form.items.splice(index, 1)" class="delete-link">Quitar</button></td>
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

      <p v-if="error" class="error-msg">Error: {{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Reutilizando tus clases */
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