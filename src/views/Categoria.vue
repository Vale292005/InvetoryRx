<script setup>

import {useFilteredSearch} from "@/Composable/FilterSearch.js";
import SearchProduct from "@/components/SearchProduct.vue";
import Accordion from "@/components/Accordion.vue";
import {useAuthStore} from "@/stores/auth.store.js";
import {useRouter} from "vue-router";
import Sidebar from "@/components/Sidebar.vue";

const route=useRouter();
const authStore=useAuthStore();
const username=authStore.user?.username||'Usuario';

const props=defineProps({
  username:{type:String,default:'User'},
  menu:{
    type:Array,
    default:()=>["Productos","Orden", "Categorias", "Activos", "Stock"]
  }
});

const handleMenu=(item)=>{
  if(item==='Orden'){
    route.push('/orden');
  }
}

const {
  searchQuery,
  categoriaSeleccionada,
  productos,
  cargando
} = useFilteredSearch();

const listaCategorias = ["Todos", "Electronica", "Limpieza", "Hogar"];

const seleccionarCat = (cat) => {
  categoriaSeleccionada.value = cat;
};
</script>

<template>
<div class="dashboard-contaianer">
  <div class="header-container">
    <Sidebar/>
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
        :class="{'subrayado':item==='Categorias'}"
    >
      {{item}}</h3>
  </div>

  <div class="search-container">
    <Accordion
        title="Categorías"
        :text="categoriaSeleccionada"
        :items="listaCategorias"
        @select="seleccionarCat"
    />

    <SearchProduct
        v-model:searchQuery="searchQuery"
        :productos="productos"
        :cargando="cargando"
    />
  </div>

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
  justify-content: space-between;
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
.search-container{
  width: 100%;
  height: auto;
  padding: 20px;
}
.subrayado{
  text-decoration: underline;
}
</style>