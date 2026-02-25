<script setup>
import {callWithAsyncErrorHandling, handleError, ref} from "vue";
import InputSearch from "@/components/InputSearch.vue";
import CustomInput from "@/components/CustomInput.vue";
import Switch from "@/components/Switch.vue";
import CustomButton from "@/components/CustomButton.vue";
import SearchProduct from "@/components/SearchProduct.vue";
import {useToggleStatus} from "@/Composable/activarProduct.js";

const resultado=ref([]);
const cargando=ref(false);
const textoInput=ref('');

const productoActivo=ref(true);
const { form, loading, error, toggleStatus, setProductoData, idProducto }=useToggleStatus();

const handleActivar=async ()=>{
  try{
    await toggleStatus();
    if (!error.value) {
      alert("Producto actualizado con éxito");
    }
  } catch(e){
    console.error(e);
  }
};
const productoSeleccionado = (prod) => {
  setProductoData(prod);
  confirmarSwicth.value=false;
};

const title=ref({
  search: 'Ingrese el producto',//0
  placeHolderSearch:'Ingrese el nombre del  producto',//1
  Name:'Nombre',                                      //2
  placeHolderName:'Ingrese el nombre',                //3
  description:'Descripción',                          //4
  placeHolderDescription:'Ingrese la descripción',    //5
  swicth:'Activo'                                     //6
});
</script>

<template>
<div class="container-form">

  <SearchProduct
      :productos="productos"
      :cargando="cargando"
      v-model:searchQuery="searchQuery"
      @select="productoSeleccionado"
  />

  <custom-input
    :label="title.Name"
    :placeholder="title.placeHolderName"
    v-model="form.nombre"
  />

  <custom-input
      :label="title.description"
      :placeholder="title.placeHolderDescription"
      v-model="form.descripcion"
  />

  <Switch
    :title="title.swicth"
    v-model="productoActivo"
  />

  <p v-if="error" style="color: red; font-size: 12px;">{{ error }}</p>

  <CustomButton
    label="Aceptar"
    @click="handleActivar"
  />

</div>
</template>

<style scoped>
.container-form{
  display:flex;
  flex-direction: column;
  width: 325px;
  height: auto;
  gap: 10px;
  padding: 17px 24px;
  background: white;
  box-sizing: border-box;
  align-items: center;
}
.funtional-card{
  display: flex;
  flex-direction: row;
  width: 325px;
  height: auto;
  align-items: center;
  gap:10px;
  padding: 10px 20px;
  border-radius: 6px;
}
.text-button{
  color: var(--color-brand-30);
}
</style>