<script setup>
import SearchResults from "../components/SearchResults.vue";
import SearchProduct from "@/components/SearchProduct.vue";
import { useSearchClientes } from "../Composable/useSearchCliente";
import Accordion from "@/components/Accordion.vue";
import { useAuthStore } from "@/stores/auth.store.js";
import { useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import router from "@/router/index.js";
import { onMounted } from "vue";

const route = useRouter();
const authStore = useAuthStore();
const username = authStore.user?.username || 'Usuario';

const props = defineProps({
  username: { type: String, default: 'User' },
  menu: {
    type: Array,
    default: () => [
      { name: "Productos", path: "/dashboard-producto" },
      { name: "Orden", path: "/orden" },
      { name: "Cliente", path: "/cliente" },
      { name: "Activos", path: "/activos" },
      { name: "Stock", path: "/stock" }
    ]
  }
});

const handleMenu = (item) => {
  if (item.path) {
    router.push(item.path);
  } else {
    console.warn('error')
  }
};

const {
  searchQuery,
  resultado,
  loadingSearch,
  obtenerClientes
} = useSearchClientes();

const listaCategorias = ["Activos", "Desactivados"];

const seleccionarCat = (cat) => {
  categoriaSeleccionada.value = cat;
};

onMounted(() => {
  obtenerClientes(searchQuery.value);
})
</script>

<template>
  <div class="dashboard-contaianer">
    <div class="header-container">
      <Sidebar />
    </div>
    <div class="hello-container">
      <h3>Bienvenido, {{ username }}!</h3>
    </div>

    <div class="menu-container">
      <h3 v-for="item in props.menu" :key="item.name" @click="handleMenu(item)" class="menu-item"
        :class="{ 'subrayado': item.name === 'Activos' }">
        {{ item.name }}</h3>
    </div>

    <div class="searchProductos-container">
      <Accordion title="Estado" :text="categoriaSeleccionada" :items="listaCategorias" @select="seleccionarCat" />
      <SearchProduct placeholder="Buscar por nombre..." v-model:searchQuery="searchQuery" />
    </div>

    <div class="searchCliente-container">
      <Accordion title="Estado" :text="categoriaSeleccionada" :items="listaCategorias" @select="seleccionarCat" />
      <SearchResults titulo="Listado de Clientes" placeholder="Buscar por nombre..." :productos="resultado"
        v-model:searchQuery="searchQuery" />
    </div>

  </div>
</template>

<style scoped>
.dashboard-contaianer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 10px;

  background: linear-gradient(to bottom, var(--color-brand-90), #ffffff);

}

.header-container {
  width: 100%;
  height: auto;
  justify-content: left;
  padding: 10px;
  background: linear-gradient(to bottom, var(--color-brand-80), var(--color-brand-90));
}

.header-container img {
  width: 210px;
  height: auto;
}

.hello-container {
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

.menu-container {
  display: flex;
  width: auto;
  height: auto;
  gap: 16px;
  padding: 8px 20px;
  overflow-y: auto;
  justify-content: space-between;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.menu-item {
  cursor: pointer;
  margin: 0;
  color: var(--color-brand-30);
}

.search-container {
  width: 100%;
  height: auto;
  padding: 20px;
}

.subrayado {
  text-decoration: underline;
}
</style>