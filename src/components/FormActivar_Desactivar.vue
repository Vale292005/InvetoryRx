<script setup>
import { callWithAsyncErrorHandling, handleError, ref } from "vue";
import InputSearch from "@/components/InputSearch.vue";
import CustomInput from "@/components/CustomInput.vue";
import Switch from "@/components/Switch.vue";
import CustomButton from "@/components/CustomButton.vue";
import SearchProduct from "@/components/SearchProduct.vue";
import { useToggleStatus } from "@/Composable/activarProduct.js";

const resultado = ref([]);
const cargando = ref(false);
const textoInput = ref('');

const productoActivo = ref(true);
const { form, loading, error, toggleStatus, setProductoData, idProducto } = useToggleStatus();

const handleActivar = async () => {
  try {
    await toggleStatus();
    if (!error.value) {
      alert("Producto actualizado con éxito");
    }
  } catch (e) {
    console.error(e);
  }
};
const productoSeleccionado = (prod) => {
  setProductoData(prod);
  confirmarSwicth.value = false;
};

const title = ref(['Crear Producto', 'Nombre', 'Ingrese nombre', 'Descripción', 'Ingrese descripción', 'Precio', 'Ingrese precio', 'Stock', 'Ingrese stock', 'Mínimo stock', 'Ingrese mínimo', 'Categoría']);
</script>

<template>
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

      <p v-if="error" style="color: red; font-size: 12px;">{{ error }}</p>

      <CustomButton
          :label="loading ? 'Actualizando...' : 'Actualizar'"
          :disabled="loading"
          @click="handleActualizar"
      />

  </div>
</template>

<style scoped>
.container-form {
  display: flex;
  flex-direction: column;
  width: 325px;
  height: auto;
  gap: 10px;
  padding: 17px 24px;
  background: white;
  box-sizing: border-box;
  align-items: center;
}

.funtional-card {
  display: flex;
  flex-direction: row;
  width: 325px;
  height: auto;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 6px;
}

.text-button {
  color: var(--color-brand-30);
}
</style>