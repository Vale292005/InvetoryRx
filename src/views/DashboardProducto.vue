<script setup>
import ButtonForm from "@/components/ButtonForm.vue";
import InputSearch from "@/components/InputSearch.vue";
import {ref} from "vue";
import SearchProduct from "@/components/SearchProduct.vue";
import {searchProductos} from "@/Composable/SearchProductos.js";
import {useAuthStore} from "@/stores/auth.store.js";
import {useRouter} from "vue-router";
import Sidebar from "@/components/Sidebar.vue";

const authStore=useAuthStore();
const username=authStore.user?.username||'Usuario';
const route=useRouter();

const handleMenu=(item)=>{
  if(item==='Orden'){
    route.push('/orden');
  }
}

const productoColumnas = ref([
  { label: 'Producto', key: 'nombre' },
  { label: 'Cantidad', key: 'cantidad' },
  { label: 'Código', key: 'codigo' }
]);
const productoFilas = ref([
  { nombre: 'Producto de prueba', cantidad: 10, codigo: '001' }
]);

const props=defineProps({
  username:{type:String,default:'User'},
  menu:{
    type:Array,
    default:()=>["Productos","Orden", "Categorias", "Activos", "Stock"]
  }
});

const busqueda=ref('');

const handleSearch=(valor)=>{
  busqueda.value=valor;
  console.log(busqueda.value);
}

const { searchQuery, productos, cargando } = searchProductos();

</script>

<template>
<div class="dashboard-contaianer">
  <div class="header-container">
    <sidebar/>
  </div>
  <div class="hello-container">
    <h3>Bienvenido, {{username}}!</h3>
  </div>

  <div class="menu-container">
    <h3
        v-for="(item,index) in menu"
        :key="index"
        @click="handleMenu(item)"
        class="menu-item"
        :class="{'subrayado':item==='Productos'}"
    >
      {{item}}</h3>
  </div>

  <div class="buttons-container">
    <div class="crear-container">
      <ButtonForm
          title="Crear producto"/>
    </div>
    <div class="actualizar-container">
      <ButtonForm
          title="Actualizar producto"/>
    </div>
    <div class="eliminar-container">
      <ButtonForm
          title="Eliminar producto"/>
    </div>
    <div class="activar-container">
      <ButtonForm
          title="Activar/Desactivar"/>
    </div>

  </div>
  <SearchProduct
      :productos="productos"
      :cargando="cargando"
      v-model:searchQuery="searchQuery"
  />
  <SearchProduct
      placeholder="Buscar producto por código"
      :productos="productos"
      :cargando="cargando"
      v-model:searchQuery="searchQuery"
  />
</div>
</template>

<style scoped>
.dashboard-contaianer{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 10px;

  background: linear-gradient(to bottom,var(--color-brand-90),#ffffff);

}
.header-container{
  width: 100%;
  height: auto;
  justify-content: left;
  padding: 10px;
  background: linear-gradient(to bottom,var(--color-brand-80),var(--color-brand-90));
}
.header-container img{
  width: 210px;
  height: auto;
}
.hello-container{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 0;
  color: var(--color-brand-20);
}
.menu-container{
  display:flex;
  width: auto;
  height: auto;
  gap: 16px;
  padding: 8px 20px;
  overflow-y: auto;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar{
    display: none;
  }
}
.menu-item{
  cursor: pointer;
  margin: 0;
  color: var(--color-brand-30);
}
.buttons-container{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 10px 20px;
  align-items: center;
  box-sizing: border-box;
}
@media(min-width: 760px){
  .menu-container{
    gap: 0;
    justify-content: space-between;
  }
  .buttons-container{
    flex-direction: row;
    align-items: start;
  }
}
.table-container{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 20px 20px;
}
.search-container{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 10px 20px;
}
.crear-container,
 .actualizar-container,
 .eliminar-container,
 .activar-container{
  width: auto;
  height: auto;
  border: 1px solid var(--color-brand-30);
  border-radius: 6px;
}
.subrayado{
  text-decoration: underline;
}
</style>