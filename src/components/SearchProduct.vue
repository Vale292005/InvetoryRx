<script setup>
import {searchProductos} from "@/Composable/SearchProductos.js";
const emit = defineEmits(['select']);
const props = defineProps({
  placeholder: {
    type: String,
    default: "Buscar producto por nombre"
  },
  titulo: {
    type: String,
    default: "Listado de productos"
  }
});

const seleccionar = (p) => {
  emit('select', p);
};

const {searchQuery,productos}=searchProductos();
</script>

<template>
  <div class="container">
    <div class="input-container">
      <text-button>{{props.titulo}}</text-button>
      <input
          v-model="searchQuery"
          :placeholder="props.placeholder"
          class="search-input"
      >
    </div>
    <div v-if="productos && productos.length>0" class="table-wrapper">
      <table class="product-table">
        <thead>
        <tr>
          <th>Nombre</th>
          <th>Código</th>
          <th>Stock</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(p, index) in productos" :key="p.code||index" @click="seleccionar(p)">
          <td>{{p.name}}</td>
          <td>{{p.code}}</td>
          <td>{{p.stock}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="loading-state">
      <overline>Esperando datos o error en la conexión</overline>
    </div>
  </div>
</template>

<style scoped>
.container{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 20px;
  box-sizing: border-box;
}
.input-container{
  display: flex;
  flex-direction: column;
  width: 250px;
  height: auto;
  gap: 10px;
  box-sizing: border-box;
}
.input-container text-button{
  color: var(--color-brand-30);
}
.search-input {
  width: 100%;
  height: auto;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 6px;
  box-sizing: border-box;

  background: var(--color-brand-80);
  border: 2px solid var(--color-brand-40);
}
.search-input::placeholder{
  font-family: arimo, serif;
  font-size: 16px;
  color: var(--color-brand-30);
}
.table-wrapper{
  max-height: 132px;
  overflow-y: auto;
}
.product-table{
  width: 100%;
  border-collapse: collapse;
  font-family: arimo, serif;
}

th{
  padding: 6px 10px;
  background: var(--color-brand-20);
  color: white;
  text-align: left;
}
td{
  padding: 2px 8px;
}

tbody tr:nth-child(odd){
  background-color:white;
}
tbody tr:nth-child(even){
  background-color:var(--color-brand-80);
}

</style>