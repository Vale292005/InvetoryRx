<script setup>
import { useCrearMercancia } from "@/Composable/useCrearMercancia.js";
import { useNotification } from "../Composable/useNotification";
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import { ref } from "vue";

const { notify } = useNotification();
const { form, loading, error, saveGoodsReceipt, agregarItem } = useCrearMercancia();

const handleCrear = async () => {
    try {
        await saveGoodsReceipt();
        notify("Recepción creada con éxito", "success");
    } catch (e) {
        // Error manejado por el composable
    }
};

// Simulación de añadir un producto (Esto lo podrías conectar a un buscador)
const añadirProductoManual = () => {
    agregarItem({
        id: Date.now(),
        code: "NUEVO-01",
        name: "Producto Seleccionado",
        orderedQuantity: 1,
        receivedQuantity: 1
    });
};
</script>

<template>
  <div class="container-card">
    <div class="container-form">
      
      <CustomInput
          label="ID de la Orden"
          placeholder="Ingrese el ID de la orden de compra"
          v-model="form.orderId" />

      <CustomInput
          label="Observaciones"
          placeholder="Notas sobre el recibo"
          v-model="form.notes" />

      <div class="items-wrapper">
          <div class="items-header">
              <span class="items-title">Productos a Recibir</span>
              <button class="add-btn" @click="añadirProductoManual">+ Añadir</button>
          </div>

          <div v-if="form.items.length === 0" class="empty-state">
              No hay productos en la lista
          </div>

          <table v-else class="styled-table">
              <thead>
                  <tr>
                      <th>Producto</th>
                      <th width="80px">Cant.</th>
                      <th width="40px"></th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(item, index) in form.items" :key="index">
                      <td>
                          <div class="product-info">
                              <span class="p-name">{{ item.productName }}</span>
                              <span class="p-code">{{ item.productCode }}</span>
                          </div>
                      </td>
                      <td>
                          <input 
                            type="number" 
                            v-model.number="item.receivedQuantity" 
                            class="inner-input"
                          />
                      </td>
                      <td>
                          <button @click="form.items.splice(index, 1)" class="delete-btn">×</button>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>

      <div class="container-button">
          <CustomButton
              :label="loading ? 'Procesando...' : 'Guardar Recepción'"
              :disabled="loading || form.items.length === 0"
              @click="handleCrear"
          />
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
/* TUS ESTILOS ORIGINALES */
.container-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  background: white;
}
.container-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 6px;
}
.container-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 12px;
  padding: 16px 24px;
  box-sizing: border-box;
  align-items: center;
}

/* ESTILOS ADAPTADOS PARA LA TABLA DE ITEMS */
.items-wrapper {
    width: 100%;
    margin-top: 10px;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
}

.items-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f8f9fa;
    border-bottom: 1px solid #eee;
}

.items-title {
    font-size: 13px;
    font-weight: 600;
    color: #666;
}

.styled-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
}

.styled-table th {
    text-align: left;
    padding: 10px;
    color: #888;
    font-weight: 500;
    border-bottom: 1px solid #eee;
}

.styled-table td {
    padding: 10px;
    border-bottom: 1px solid #f5f5f5;
}

.product-info {
    display: flex;
    flex-direction: column;
}

.p-name { font-weight: 500; color: #333; }
.p-code { font-size: 11px; color: #999; }

.inner-input {
    width: 100%;
    padding: 4px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
}

.add-btn {
    background: #f0f0f0;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

.delete-btn {
    background: none;
    border: none;
    color: #ff4d4f;
    font-size: 18px;
    cursor: pointer;
}

.empty-state {
    padding: 20px;
    text-align: center;
    color: #ccc;
    font-size: 13px;
}

.error-msg {
    color: #ff4d4f;
    font-size: 12px;
    margin-top: 5px;
}
</style>