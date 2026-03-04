<script setup>

import ButtonForm from "@/components/ButtonForm.vue";
import Accordion from "@/components/Accordion.vue";
import CustomInput from "@/components/CustomInput.vue";
import SearchProduct from "@/components/SearchProduct.vue";

const productoSeleccionado = (prod) => {
  setProductoData(prod);
  confirmarSwicth.value=false;
};

const title=['Proveedor','Elíja la categoría','Observaciones','Ingrese observaciones','Ingrese el producto','Ingrese el nombre del producto','Crear']

</script>

<template>
  <div class="funtional-card">
    <Accordion
        :title="title[0]"
        :text="form.categoria || 'Seleccione una opción'"
        :items="opciones"
        @select="alSeleccionar"
    />
    <Custom-input
        :label="title[3]"
        :placeholder="title[4]"
        v-model="form.descripcion" />
    <SearchProduct
        :productos="productos"
        :cargando="cargando"
        v-model:searchQuery="searchQuery"
        @select="productoSeleccionado"
    />
  </div>
</template>

<style scoped>

</style>