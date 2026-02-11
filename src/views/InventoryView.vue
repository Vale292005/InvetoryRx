<script setup>
import {onMounted} from "vue";
import {useInvetoryStore} from "../stores/inventory.store.js";

const store=useInvetoryStore()

onMounted(()=>{
  store.fetchProducts()
})
</script>

<template>
  <h1>Inventario</h1>
  <div v-if="store.loading">Cargando...</div>
  <ul v-else>
    <li v-for="p in store.products":key="p.id">
      {{p.name}}-{{p.stock}}
    </li>
  </ul>

</template>

<style scoped>

</style>