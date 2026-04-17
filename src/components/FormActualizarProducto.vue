<script setup>
import { ref } from "vue";
import { Categoria } from "@/enums/Categoria.js";
import { searchProductos } from "@/Composable/SearchProductos.js";
import { useActualizarProduct } from "@/Composable/actualizarProduct.js";
import Switch from "@/components/Switch.vue";

// Componentes
import CustomInput from "@/components/CustomInput.vue";
import Accordion from "@/components/Accordion.vue";
import CustomButton from "@/components/CustomButton.vue";
import SearchProduct from "@/components/SearchProduct.vue";

const { searchQuery, productos, cargando } = searchProductos();
const { form, loading, error, updateProduct, setProductoData } = useActualizarProduct();

const opciones = Object.values(Categoria);

// Cuando el buscador selecciona un producto
const productoSeleccionado = (prod) => {
  setProductoData(prod); // Esto rellena los campos automáticamente
};

const handleActualizar = async () => {
  try {
    await updateProduct();
    if (!error.value) {
      alert("Producto actualizado con éxito");
    }
  } catch (e) {
    console.error(e);
  }
};

const title = ref(['Crear Producto', 'Nombre', 'Ingrese nombre', 'Descripción', 'Ingrese descripción', 'Precio', 'Ingrese precio', 'Stock', 'Ingrese stock', 'Mínimo stock', 'Ingrese mínimo', 'Categoría']);
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

      <Custom-input :label="title[1]" v-model="form.name" />
      <Custom-input :label="title[3]" v-model="form.description" />
      <Custom-input type="number" :label="title[5]" v-model.number="form.price" />
      <Custom-input type="number" :label="title[7]" v-model.number="form.stock" />
      <Custom-input type="number" :label="title[9]" v-model.number="form.minStock" />
      <Custom-input label="Código del producto" v-model="form.code" />
      <Switch v-model="form.active" label="Activo"></Switch> 

      <Accordion
          :title="title[11]"
          :text="form.category || 'Seleccione una opción'"
          :items="opciones"
          @select="(item) => form.category = item"
      />

      <p v-if="error" style="color: red; font-size: 12px;">{{ error }}</p>

      <CustomButton
          :label="loading ? 'Actualizando...' : 'Actualizar'"
          :disabled="loading"
          @click="handleActualizar"
      />
    </div>
  </div>
</template>

<style scoped>
.container-card{
  display: flex;
  flex-direction: column;
  width: 325px;
  height: auto;
  background: white;
}
.container-button{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 6px;
}
.container-form{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 16px 24px;
  justify-content: center;
  box-sizing: border-box;
  align-items: center;
}
</style>