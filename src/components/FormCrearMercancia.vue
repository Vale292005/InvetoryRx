<script setup>
import {useCrearMercancia} from "@/Composable/useCrearMercancia.js";
import { useNotification } from "../Composable/useNotification";
import { onMounted } from "vue";
import { getAllSuppliers } from "../api/proveedor";
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import Accordion from "@/components/Accordion.vue"; 
import { ref } from "vue"; 

const notify = useNotification();
const { form, loading, error, saveMercancia } = useCrearMercancia();   
const handleCrear=async()=>{
    try{
        const nuevaMercancia = await saveMercancia();
        notify("Mercancía creada con éxito", "success");
    }
    catch(e){
        notify("Error al crear mercancía", "error");
    }
}

//Lógica para manejar proveedores
const proveedores = ref([]);
const cargarProveedores = async () => {
    try {
        const data= await getAllSuppliers();
        proveedores.value = data;
    } catch (error) {
        console.error(error);
        notify("Error al cargar proveedores", "error");
    }
};


onMounted(() => {
    cargarProveedores();
});

</script>

<template>
  <div class="container-card">
    <div class="container-form">
      <Custom-input
          label=Nombre
          placeholder="Ingrese el nombre"
          v-model="form.name" />

      <Custom-input
          label=Descripción
          placeholder="Ingrese la descripción"
          v-model="form.descripcion" />

      <Custom-input
          type="number"
          label="Cantidad"
          placeholder="Ingrese la cantidad"
          v-model.number="form.quantity" />

      <Accordion
          title="Proveedor"
          text="Seleccione un proveedor"
          :items="proveedores"
          @select="alSeleccionar"
      />

      <CustomButton
          :label="loading ? 'Cargando...' : 'Crear'"
          :disabled="loading"
          @click="handleCrear"
      />

      <p v-if="error" style="color: red; font-size: 12px;">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.container-card{
  display: flex;
  flex-direction: column;
  width: 100%;
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
  box-sizing: border-box;
  align-items: center;
}
</style>