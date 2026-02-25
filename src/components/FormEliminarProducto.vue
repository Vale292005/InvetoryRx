<script setup>
import {handleError, ref} from "vue";
import Switch from "@/components/Switch.vue";
import Accordion from "@/components/Accordion.vue";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import {Categoria} from "@/enums/Categoria.js";
import SearchProduct from "@/components/SearchProduct.vue";
import {useEliminarProducto} from "@/Composable/eliminarProduct.js";
const { form, idProducto, loading, error: apiError, setProductoData, deleteProduct } = useEliminarProducto();

const eliminar=ref(false);
const error=ref(false);
const opciones=Object.values(Categoria);

const productoSeleccionado = (prod) => {
  setProductoData(prod);
  confirmarSwicth.value=false;
};

const title = ref([
  'Eliminar Producto',      // 0: Header
  'Nombre',              // 1: Label 1
  'Ingrese el nombre',   // 2: Placeholder 1
  'Descripción',         // 3: Label 2
  'Ingrese descripción', // 4: Placeholder 2
  'Categoría',            // 5: Accordion/Select
  'Apruebo eliminar el producto ⚠️',
  'Eliminar'
]);

const handleEliminar = async () => {
  try {
    await deleteProduct();
    if (!error.value) {
      alert("Producto eliminado con éxito");
    }
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="container-card">

    <div class="container-form">

      <SearchProduct
          :productos="productos"
          :cargando="cargando"
          v-model:searchQuery="searchQuery"
          @select="productoSeleccionado"
      />

      <Custom-input
          :label="title[1]"
          :placeholder="title[2]"
          v-model="form.nombre"
      />

      <Custom-input
          :label="title[3]"
          :placeholder="title[4]"
          v-model="form.descripcion"
      />

      <Accordion
          :title="title[5]"
          :text="form.categoria||'sin categoria'"
          :items="opciones"
          :error="error"
      />

      <Switch
        :title="title[6]"
        v-model="eliminar"
      />

      <p v-if="apiError" style="color: red; font-size: 14px; font-weight: bold; margin: 10px 0;">
        {{ apiError }}
      </p>

      <CustomButton
        :label="title[7]"
        @click="handleEliminar"
      />
    </div>
  </div>
</template>

<style scoped>
.container-card{
  display:flex;
  flex-direction: column;
  width: 325px;
  height: auto;
  gap: 10px;
  padding: 16px 24px;
  background: white;
  box-sizing: border-box;
  align-items: center;
}
.container-form{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>