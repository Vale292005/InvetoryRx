<script setup>

import { crearProduct } from "@/Composable/crearProduct.js";
import { Categoria } from "@/enums/Categoria.js";
import { ref } from "vue";
import CustomButton from "@/components/CustomButton.vue";
import Switch from "@/components/Switch.vue";
import Accordion from "@/components/Accordion.vue";
import CustomInput from "@/components/CustomInput.vue";

const { form, loading, error, saveProduct } = crearProduct();

const opciones = Object.values(Categoria);

const alSeleccionar = (item) => {
  form.categoria = item;
};

const handleCrear = async () => {
  try {
    const nuevoProducto = await saveProduct();
    alert(`Producto "${nuevoProducto.nombre}" creado con éxito`);
  } catch (e) {
    console.error("Error al crear:", e);
  }
};

const title = ref(['Crear Producto', 'Nombre', 'Ingrese el nombre', 'Descripción', 'Ingrese descripción', 'Precio', 'Ingrese el precio', 'Stock', 'Ingrese el stock', 'Mínimo stock', 'Ingrese el mínimo', 'Categoría']);

</script>

<template>
  <div class="container-card">
    <div class="container-form">
      <Custom-input :label="title[1]" :placeholder="title[2]" v-model="form.name" />

      <Custom-input :label="title[3]" :placeholder="title[4]" v-model="form.description" />

      <Custom-input type="number" :label="title[5]" :placeholder="title[6]" v-model.number="form.price" />

      <Custom-input label="Código del producto" placeholder="Ingrese código" v-model.number="form.code" />

      <Custom-input type="number" :label="title[7]" :placeholder="title[8]" v-model.number="form.stock" />

      <Custom-input type="number" :label="title[9]" :placeholder="title[10]" v-model.number="form.minimoStock" />

      <Accordion :title="title[11]" :text="form.categoria || 'Seleccione una opción'" :items="opciones"
        @select="alSeleccionar" />

      <Switch v-model="form.activo"></Switch>

      <CustomButton :label="loading ? 'Cargando...' : 'Crear'" :disabled="loading" @click="handleCrear" />

      <p v-if="error" style="color: red; font-size: 12px;">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.container-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  background: white;
}

.container-button {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 6px;
}

.container-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 16px 24px;
  box-sizing: border-box;
  align-items: center;
}
</style>