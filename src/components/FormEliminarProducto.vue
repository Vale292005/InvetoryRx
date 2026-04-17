<script setup>
import { handleError, ref } from "vue";
import Switch from "@/components/Switch.vue";
import Accordion from "@/components/Accordion.vue";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import { Categoria } from "@/enums/Categoria.js";
import SearchProduct from "@/components/SearchProduct.vue";
import { useEliminarProducto } from "@/Composable/eliminarProduct.js";
const { form, idProducto, loading, error: apiError, setProductoData, deleteProduct } = useEliminarProducto();

const eliminar = ref(false);
const error = ref(false);
const opciones = Object.values(Categoria);

const productoSeleccionado = (prod) => {
  setProductoData(prod);
  confirmarSwicth.value = false;
};

const title = ref(['Eliminar Producto', 'Nombre', 'Ingrese nombre', 'Descripción', 'Ingrese descripción', 'Precio', 'Ingrese precio', 'Stock', 'Ingrese stock', 'Mínimo stock', 'Ingrese mínimo', 'Categoría']);

const handleEliminar = async () => {
  try {
    await deleteProduct();
    if (!error.value) {
      notify("Producto eliminado con éxito");
    }
  } catch (e) {
    console.error(e);
    notify("Error al eliminar el producto");
  }
};
</script>

<template>
  <div class="container-card">

    <div class="container-form">

      <SearchProduct :productos="productos" :cargando="cargando" v-model:searchQuery="searchQuery"
        @select="productoSeleccionado" />
      <Custom-input :label="title[1]" v-model="form.name" />
      <Custom-input :label="title[3]" v-model="form.description" />
      <Custom-input type="number" :label="title[5]" v-model.number="form.price" />
      <Custom-input type="number" :label="title[7]" v-model.number="form.stock" />
      <Custom-input type="number" :label="title[9]" v-model.number="form.minStock" />
      <Custom-input label="Código del producto" v-model.number="form.code" />
      <Switch v-model="form.active" label="Activo"></Switch> 

      <Accordion
          :title="title[11]"
          :text="form.category || 'Seleccione una opción'"
          :items="opciones"
          @select="(item) => form.category = item"
      />

      <p v-if="apiError" style="color: red; font-size: 14px; font-weight: bold; margin: 10px 0;">
        {{ apiError }}
      </p>

      <CustomButton label="Eliminar" @click="handleEliminar" />
    </div>
  </div>
</template>

<style scoped>
.container-card {
  display: flex;
  flex-direction: column;
  width: 325px;
  height: auto;
  gap: 10px;
  padding: 16px 24px;
  background: white;
  box-sizing: border-box;
  align-items: center;
}

.container-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>