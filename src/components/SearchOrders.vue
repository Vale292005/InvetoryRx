<script setup>
import { onMounted, watch } from "vue";
import { useOrders } from "@/Composable/useOrders.js";
import { useNotification } from '@/Composable/useNotification.js';
import { useRouter } from "vue-router";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";

const emit = defineEmits(['select']);
const props = defineProps({
  placeholder: {
    type: String,
    default: "Buscar orden por número..."
  },
  titulo: {
    type: String,
    default: "Listado de Órdenes"
  }
});

const { orders, loading, error, getAll, getByStatus } = useOrders();

onMounted(() => {
  getAll();
});

const seleccionar = (order) => {
  emit('select', order);
};


</script>

<template>
  <div class="container">
    <div class="input-container">
      <h4>{{ props.titulo }}</h4>

      <input :placeholder="placeholder" class="search-input">

      <div class="filter-chips">
        <button @click="getByStatus('PENDING')">Pendientes</button>
        <button @click="getByStatus('COMPLETED')">Listas</button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <span v-if="error" class="text-overline">{{ error }}</span>
    </div>

    <div v-else-if="orders && orders.length > 0" class="table-wrapper">
      <table class="product-table">
        <thead>
          <tr>
            <th>N° Orden</th>
            <th>Estado</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(o, index) in orders" :key="o.id || index" @click="seleccionar(o)">
            <td>{{ o.orderNumber }}</td>
            <td>
              <span :class="'status-' + o.status.toLowerCase()">
                {{ o.status }}
              </span>
            </td>
            <td>${{ o.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="loading-state">
      <overline v-if="error">{{ error }}</overline>
      <overline v-else>No se encontraron órdenes</overline>
    </div>
  </div>
</template>

<style scoped>
/* Estructura General */
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 20px;
  box-sizing: border-box;
}

/* Columna de inputs (Ancho fijo de 250px) */
.input-container {
  display: flex;
  flex-direction: column;
  width: 250px;
  height: auto;
  gap: 10px;
  box-sizing: border-box;
}

.titulo-label {
  color: var(--color-brand-30);
  font-weight: bold;
  font-family: arimo, serif;
}

/* Estilo del Input de búsqueda */
.search-input {
  width: 100%;
  height: auto;
  padding: 8px 10px;
  border-radius: 6px;
  box-sizing: border-box;
  background: var(--color-brand-80);
  border: 2px solid var(--color-brand-40);
}

.search-input::placeholder {
  font-family: arimo, serif;
  font-size: 16px;
  color: var(--color-brand-30);
}

/* Chips de filtro */
.filter-chips {
  display: flex;
  gap: 5px;
}

.filter-chips button {
  font-size: 10px;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid var(--color-brand-40);
  background: white;
  color: var(--color-brand-20);
}

/* Tabla y Scroll */
.table-wrapper {
  max-height: 132px;
  /* Según tu estilo solicitado */
  overflow-y: auto;
  border: 1px solid var(--color-brand-80);
  border-radius: 4px;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  font-family: arimo, serif;
}

th {
  padding: 6px 10px;
  background: var(--color-brand-20);
  color: white;
  text-align: left;
  position: sticky;
  top: 0;
}

td {
  padding: 4px 8px;
  font-size: 14px;
}

/* Efecto Cebra */
tbody tr:nth-child(odd) {
  background-color: white;
}

tbody tr:nth-child(even) {
  background-color: var(--color-brand-80);
}

tbody tr:hover {
  background-color: var(--color-brand-40);
  cursor: pointer;
}

/* Colores de Estado */
.status-pending {
  color: orange;
  font-weight: bold;
}

.status-completed {
  color: green;
  font-weight: bold;
}

.status-cancelled {
  color: red;
  font-weight: bold;
}

.error-msg {
  color: red;
  font-weight: bold;
}
</style>