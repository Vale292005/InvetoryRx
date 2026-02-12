<script setup>
import {computed, onMounted, ref} from "vue";
import {useInvetoryStore} from "../stores/inventory.store.js";


const store=useInvetoryStore()

const product=ref({
  code: '',
  name: '',
  description: '',
  price: 0,
  stock: 0,
  minStock: 0,
  category: ''
})

onMounted(()=>{
  store.fetchProducts()
})

const canSave=computed(()=>{
  return product.value.name.trim().length>0
})
const addProduct=async()=>{
  if(!canSave.value)return
  await store.addProduct(product.value)
  product.value={
    code: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    minStock: 0,
    category: ''
  }
}
</script>


<template>
  <div style="padding: 20px;">
    <h1>Inventario</h1>

    <p v-if="store.loading">Cargando...</p>
    <p v-if="store.error">{{ store.error }}</p>

    <!-- Lista de productos -->
    <ul v-if="!store.loading && store.products.length">
      <li v-for="p in store.products" :key="p.id">
        <strong>{{ p.name }}</strong> — Stock: {{ p.stock }} — Precio: {{ p.price }}
        <button @click="store.deleteProduct(p.id)">Eliminar</button>
      </li>
    </ul>

    <p v-else>No hay productos.</p>

    <!-- Formulario -->
    <h2>Nuevo producto</h2>
    <div style="display:flex; flex-direction:column; gap:5px; max-width:300px">
      <input v-model="product.code" placeholder="Código" />
      <input v-model="product.name" placeholder="Nombre" />
      <input v-model="product.description" placeholder="Descripción" />
      <input type="number" v-model="product.price" placeholder="Precio" />
      <input type="number" v-model="product.stock" placeholder="Stock" />
      <input type="number" v-model="product.minStock" placeholder="Stock mínimo" />
      <input v-model="product.category" placeholder="Categoría" />

      <button
          @click="addProduct"
          :disabled="!canSave || store.loading"
      >
        Guardar
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>