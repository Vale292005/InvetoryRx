<script setup>
import {computed, ref} from "vue";
import FormActivar_Desactivar from "@/components/FormActivar_Desactivar.vue";
import FormActualizarProducto from "@/components/FormActualizarProducto.vue";
import FormCrearProducto from "@/components/FormCrearProducto.vue";
import FormEliminarProducto from "@/components/FormEliminarProducto.vue";
import FormCrearCliente from "./FormCrearCliente.vue";
import FormActualizarCliente from "./FormActualizarCliente.vue";
import FormCrearUsuario from "./FormCrearUsuario.vue";
import FormActualizarUsuario from "./FormActualizarUsuario.vue";

const mostrarCard=ref(false);
const props=defineProps({
  title:{type:String,default:'button'}
});

const formsMap={
  'Actualizar producto':FormActualizarProducto,
  'Crear producto':FormCrearProducto,
  'Eliminar producto':FormEliminarProducto,
  'Activar/Desactivar':FormActivar_Desactivar,
  'Crear cliente':FormCrearCliente,
  'Actualizar cliente':FormActualizarCliente,
  //'Eliminar cliente':FormEliminarCliente
  'Crear usuario':FormCrearUsuario,
  'Actualizar usuario':FormActualizarUsuario
};

const componenteActual=computed(()=>{
  return formsMap[props.title]
});

const alTerminar = () => {
  mostrarCard.value = false;
};

</script>

<template>
<div class="container">
  <div class="funtional-card" @click="mostrarCard=!mostrarCard">
    <text-button class="text-button">{{ props.title }}</text-button>
  </div>
  <component
      :is="componenteActual"
      v-if="mostrarCard&&componenteActual"
      @success="alTerminar"
  />
</div>
</template>

<style scoped>
.container{
  display: flex;
  flex-direction: column;
  height: auto;
  border-radius: 6px;
}
.funtional-card{
  display: flex;
  flex-direction: row;
  width: 325px;
  height: auto;
  gap: 10px;
  align-items: center;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  box-sizing: border-box;
  background: white;
}
.text-button{
  color:var(--color-brand-10);
}

</style>