<script setup>
import ButtonForm from "@/components/ButtonForm.vue";
import { computed, onMounted, ref } from "vue";
import SearchProduct from "@/components/SearchProduct.vue";
import { searchProductos } from "@/Composable/SearchProductos.js";
import { useAuthStore } from "@/stores/auth.store.js";
import { useOrderStore } from "@/stores/order.store.js";
import CustomButton from "@/components/CustomButton.vue";
import { useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import SearchOrders from "../components/SearchOrders.vue";
import { useNotification } from '@/Composable/useNotification.js';
import { useOrders } from "@/Composable/useOrders.js";

const { orders, loading: loadingOrders, getAll } = useOrders();
onMounted((async () => {
  await getAll();
}));


const { notify } = useNotification();

const manejarSeleccion = (orden) => {
  console.log("Orden recibida del componente hijo:", orden);
  ordenSeleccionada.value = orden;
};

const authStore = useAuthStore();
const orderStore = useOrderStore();
const username = authStore.user?.username || 'Usuario';
const route = useRouter();

const handleMenu = (item) => {
  if (item.path) {
    route.push(item.path);
  } else {
    console.warn("error")
  }
}

const carrito = ref([]);

const productoColumnas = ref([
  { label: 'Producto', key: 'nombre' },
  { label: 'Cantidad', key: 'cantidad' },
  { label: 'Código', key: 'codigo' }
]);
const productoFilas = ref([
  { nombre: 'Producto de prueba', cantidad: 10, codigo: '001' }
]);

const props = defineProps({
  username: { type: String, default: 'User' },
  menu: {
    type: Array,
    default: () => [
      { name: "Productos", path: "/dashboard-producto" },
      { name: "Orden", path: "/orden" },
      { name: "Cliente", path: "/cliente" },
      { name: "Activos", path: "/activos" }
    ]
  }
});


const agregarAlCarrito = (producto) => {
  const existe = carrito.value.find(item => item.id === producto.id);

  if (existe) {
    if (existe.cantidadSeleccionada < producto.stock) {
      existe.cantidadSeleccionada++;
    }
  } else {
    carrito.value.push({
      id: producto.id,
      nombre: producto.name,
      codigo: producto.code,
      precio: producto.price,
      stockMaximo: producto.stock,
      cantidadSeleccionada: 1
    });
  }
};


const totalVenta = computed(() => {
  return carrito.value.reduce((acc, item) => acc + (item.precio * item.cantidadSeleccionada), 0);
});


const procesarOrden = async () => {
  if (carrito.value.length === 0) return;

  const payload = {
    customerId: authStore.user?.id || '1',
    items: carrito.value.map(item => ({
      productId: item.id,
      quantity: item.cantidadSeleccionada
    })),
    notes: "Venta desde Dashboard"
  };

  try {
    const nuevaOrden = await orderStore.createOrder(payload);

    if (nuevaOrden && nuevaOrden.id) {
      notify("¡Venta completada con éxito!", "success");

      const idStr = nuevaOrden.id.toString();

      carrito.value = [];

      console.log("Navegando a la URL con ID:", idStr);

      await route.push(`/pasarela-pago/${idStr}`);

    } else {
      throw new Error("El servidor no devolvió un ID de orden.");
    }
  } catch (err) {
    console.error("ERROR CRÍTICO EN PROCESAR ORDEN:", err);
    notify(err.message || "Error al procesar la orden", "error");
  }
};

const busqueda = ref('');

const handleSearch = (valor) => {
  busqueda.value = valor;
  console.log(busqueda.value);
}

const { searchQuery, productos, cargando } = searchProductos();


//pagar orden
const ordenSeleccionada = ref(null);
const irAlPago = () => {
  if (ordenSeleccionada.value) {
    route.push({ name: 'CheckoutPayment', params: { orderId: ordenSeleccionada.value.id } });
  }
}

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
      <h3 v-for="(item, index) in menu" :key="index" @click="handleMenu(item)" class="menu-item"
        :class="{ 'subrayado': item.name === 'Orden' }">
        {{ item.name }}</h3>
    </div>

    <SearchProduct placeholder="Buscar producto..." :productos="productos" :cargando="cargando"
      v-model:searchQuery="searchQuery" @select="agregarAlCarrito" />
    <div class="carrito-container" v-if="carrito.length > 0">
      <div class="carrito-header">
        <h4>Detalle de la Orden</h4>
        <span class="total-badge">Total: ${{ totalVenta.toFixed(2) }}</span>
      </div>

      <table class="carrito-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in carrito" :key="item.id">
            <td>{{ item.nombre }}</td>
            <td>{{ item.codigo }}</td>
            <td>${{ item.precio }}</td>
            <td>
              <input type="number" v-model.number="item.cantidadSeleccionada" min="1" :max="item.stockMaximo">
            </td>
            <td>${{ (item.precio * item.cantidadSeleccionada).toFixed(2) }}</td>
            <td>
              <button @click="carrito.splice(index, 1)" class="btn-remove">❌</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="actions-container">
        <custom-button label="Finalizar compra" @click="procesarOrden" :disabled="carrito.length === 0" />
      </div>
    </div>

    <p v-if="orderStore.loading">Procesando venta... por favor espera.</p>
  </div>




  <div class="orden-container">
    <text-button>Panel de Administración</text-button>
    <SearchOrders titulo="Mis Órdenes Recientes" placeholder="Escribe el código de la orden..."
      @select="manejarSeleccion" />

    <div v-if="ordenSeleccionada" class="detalle">
      <h3>Detalle de la Orden: {{ ordenSeleccionada.orderNumber }}</h3>
      <p>Total a pagar: ${{ ordenSeleccionada.total }}</p>
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

.carrito-container,
.orden-container {
  padding: 20px;
  gap: 20px;
  margin: 0;
  color: var(--color-brand-30);
}

.carrito-container h4,
.total-badge {
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

.button-container {
  width: auto;
  height: auto;
}

.carrito-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Arimo', sans-serif;
}

.carrito-table th {
  padding: 6px 10px;
  background: var(--color-brand-20);
  color: white;
  text-align: left;
  font-weight: 600;
}

.carrito-table td {
  padding: 2px 8px;
}


.carrito-table tbody tr:nth-child(odd) {
  background-color: white;
}

.carrito-table tbody tr:nth-child(even) {
  background-color: var(--color-brand-80);
}

/* Estilo para el input de cantidad dentro de la tabla */
.carrito-table input[type="number"] {
  width: 60px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>