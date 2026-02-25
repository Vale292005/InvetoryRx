<script setup>
import {computed} from "vue";

const props=defineProps({
  variant:{
    type:String,
    default:'default',
    validator:(value)=>['default','crearProducto','ActualizarProducto','eliminarProducto','activar/desactivar'].includes(value)
  },
  elevation:{type:Boolean, default:false}
});
const cardClases=computed(()=>{
  return{
    [`card--${props.variant}`]:true,
    'card--shadow':props.elevation
  };
});
</script>

<template>
<div class="card":class="cardClasses">
  <slot name="header">
    <text-button class="card-title">{{title}}</text-button>
  </slot>

  <div class="card-body">
    <slot></slot>
  </div>
</div>
</template>

<style scoped>
.card{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  gap: 10px;
  padding: 10px 20px;
}
.card--default{

}

</style>