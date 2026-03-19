<script setup>
import ButtonForm from "@/components/ButtonForm.vue";
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
    default:()=>[
      { name: "Productos", path: "/dashboard-producto" },
      { name: "Orden", path: "/orden" },
      { name: "Cliente", path: "/cliente" },
      { name: "Activos", path: "/activos" },
      { name: "Stock", path: "/stock" }
    ]
  }
});

const { 
  searchQuery, 
  categoriaSeleccionada, 
  productos, 
  cargando 
} = useFilteredSearch('users');

const roles = ["Todos", "Manager", "Sales", "Warehouse", "User"];


const handleMenu=(item)=>{
  if(item.path){
    route.push(item.path);
  }else{
    console.warn("error")
  }
}

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
        v-for="item in props.menu"
        :key="item.name"
        @click="handleMenu(item)"
        class="menu-item"
        :class="{'subrayado':item.name==='Cliente'}"
    >
      {{item.name}}</h3>
  </div>

    <div class="buttons-container">
    <div class="crear-container">
      <ButtonForm
          title="Crear cliente"/>
    </div>
    <div class="actualizar-container">
      <ButtonForm
          title="Actualizar cliente"/>
    </div>
    <div class="eliminar-container">
      <ButtonForm
          title="Eliminar cliente"/>
    </div>
  </div>

  <div class="search-container">
    <Accordion
        title="Roles"
        :text="categoriaSeleccionada"
        :items="roles"
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
.buttons-container{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 10px 20px;
  align-items: center;
  justify-content: center;
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
.crear-container,.actualizar-container,.eliminar-container{
    width: auto;
  height: auto;
  border: 1px solid var(--color-brand-30);
  border-radius: 6px;
  background-color: #ffffff;
}
</style>