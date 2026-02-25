<script setup>
import {computed, ref} from "vue";

const props=defineProps({
  columns:{
    type:Array,
    required:true
  },
  rows:{
    type:Array,
    required:true
  }
});
//limite de 8
const rowsPerPage=ref(8);

const displayRows=computed(()=>{
  return props.rows.slice(0,rowsPerPage.value);
});
</script>

Fragmento de código
<template>
  <div class="table-container">
    <div class="table-controls">
      <label for="rowLimit">Mostrar: </label>
      <select id="rowLimit" v-model="rowsPerPage">
        <option :value="8">8 filas</option>
        <option :value="15">15 filas</option>
        <option :value="30">30 filas</option>
        <option :value="rows.length">Ver todo ({{ rows.length }})</option>
      </select>
    </div>

    <table class="dynamic-table">
      <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">
          {{ column.label }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in displayRows" :key="index">
        <td v-for="column in columns" :key="column.key">
          {{ row[column.key] }}
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="rows.length > rowsPerPage" class="footer-info">
      Mostrando {{ rowsPerPage }} de {{ rows.length }} registros.
    </p>
  </div>
</template>

<style scoped>
/* Estilos anteriores + controles */
.table-controls {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: sans-serif;
}

select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
}

.dynamic-table {
  width: 100%;
  border-collapse: collapse;
}

/* El resto de tus estilos de colores (nth-child) se mantienen igual */
tr:nth-child(odd) { background-color: #cbd5e1; }
tr:nth-child(even) { background-color: #f8fafc; }

th {
  background-color: #2c3e50;
  color: white;
  padding: 12px;
  text-align: left;
}

td { padding: 12px; border-bottom: 1px solid #eee; }

.footer-info {
  margin-top: 10px;
  font-size: 0.85rem;
  color: #64748b;
}
</style>