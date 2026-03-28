<script setup>
import ButtonForm from "@/components/ButtonForm.vue";
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth.store.js";
import { useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import { useSearchUsuarios } from '@/Composable/useSearchUsuarios';
import { useSearchProveedores } from '@/Composable/useSearchProveedores';
import SearchResults from "../components/SearchResults.vue";


const authStore = useAuthStore();
const username = authStore.user?.username || 'Usuario';
const route = useRouter();

const productoColumnas = ref([
  { label: 'Producto', key: 'nombre' },
  { label: 'Cantidad', key: 'cantidad' },
  { label: 'Código', key: 'codigo' }
]);
const productoFilas = ref([
  { nombre: 'Producto de prueba', cantidad: 10, codigo: '001' }
]);

const busqueda = ref('');

const handleSearch = (valor) => {
  busqueda.value = valor;
  console.log(busqueda.value);
}


//switch entre usuario y proveedor
onMounted(() => {
  const btnUsuario = document.getElementById('btn-usuario');
  const btnProveedor = document.getElementById('btn-proveedor');
  const vistaUsuario = document.getElementById('vista-usuario');
  const vistaProveedor = document.getElementById('vista-proveedor');

  btnUsuario.addEventListener('click', () => {
    btnUsuario.classList.add('active');
    btnProveedor.classList.remove('active');
    vistaUsuario.classList.remove('hidden');
    vistaProveedor.classList.add('hidden');
  });

  btnProveedor.addEventListener('click', () => {
    btnProveedor.classList.add('active');
    btnUsuario.classList.remove('active');
    vistaProveedor.classList.remove('hidden');
    vistaUsuario.classList.add('hidden');
  });
});

//funcion para seleccionar usuario\
const { searchQuery: searchQueryUsuarios, usuarios, loading: loadingUsuarios } = useSearchUsuarios();
const { searchQuery: searchQueryProveedores, proveedores, loading: loadingProveedores } = useSearchProveedores();

const seleccionarUsuario = (usuario) => {
  console.log('Usuario seleccionado:', usuario);
};

const seleccionarProveedor = (proveedor) => {
  console.log('Proveedor seleccionado:', proveedor);
};
</script>

<template>
  <div class="dashboard-contaianer">
    <div class="header-container">
      <sidebar />
    </div>
    <div class="hello-container">
      <h3>Bienvenido, {{ username }}!</h3>
    </div>

    <div class="menu-container">
      <div class="swich-container">
        <div class="tab-item active" id="btn-usuario">
          <h3>Usuarios</h3>
        </div>
        <div class="tab-item" id="btn-proveedor">
          <h3>Proveedores</h3>
        </div>
      </div>

      <div class="seccion-container" id="vista-usuario">
        <h4>Vista de Usuarios</h4>

        <div class="buttons-container">
          <div class="crear-container">
            <ButtonForm title="Crear usuario" />
          </div>
          <div class="actualizar-container">
            <ButtonForm title="Actualizar usuario" />
          </div>
          <div class="eliminar-container">
            <ButtonForm title="Eliminar usuario" />
          </div>
        </div>

        <SearchResults titulo="Usuarios" placeholder="Buscar usuario..." :productos="usuarios"
          v-model:searchQuery="searchQueryUsuarios" @select="seleccionarUsuario" />

        <div v-if="loading">Cargando...</div>

      </div>
      <div class="seccion-container hidden" id="vista-proveedor">
        <h4>Vista de Proveedores</h4>

        <div class="buttons-container">
          <div class="crear-container">
            <ButtonForm title="Crear proveedor" />
          </div>
          <div class="actualizar-container">
            <ButtonForm title="Actualizar proveedor" />
          </div>
          <div class="eliminar-container">
            <ButtonForm title="Eliminar usuario" />
          </div>
        </div>

        <SearchResults titulo="Proveedores" placeholder="Buscar proveedor..." :productos="proveedores"
          v-model:searchQuery="searchQueryProveedores" @select="seleccionarProveedor" />
      </div>
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

.menu-item {
  cursor: pointer;
  margin: 0;
  color: var(--color-brand-30);
}

.buttons-container {
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

@media(min-width: 760px) {
  .menu-container {
    gap: 0;
    justify-content: space-between;
  }

  .buttons-container {
    flex-direction: row;
    align-items: start;
  }
}

.table-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 20px 20px;
}

.search-container {
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
.activar-container {
  width: auto;
  height: auto;
  border: 1px solid var(--color-brand-30);
  border-radius: 6px;
}

.subrayado {
  text-decoration: underline;
}

/* menu container */
.menu-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.swich-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  gap: 10px;
  padding: 0 20px;
  box-sizing: border-box;
  color: var(--color-brand-20);
  justify-content: space-between;
}

.tab-item {
  display: flex;
  width: 100%;
  height: auto;
  padding: 10px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.tab-item.active {
  border-bottom: var(--color-brand-20) solid 2px;
  background: linear-gradient(to bottom, var(--color-brand-90)0%, var(--color-brand-80)60%);
}

.seccion-container {
  padding: 20px;
  color: var(--color-brand-30);
  background: var(--color-brand-90);
  height: 100vh;
}

.hidden {
  display: none;
}
</style>