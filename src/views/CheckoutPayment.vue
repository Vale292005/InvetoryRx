<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order.store';
import CustomButton from "@/components/CustomButton.vue";
import CustomBack from "@/components/CustomBack.vue";
import { orderApi } from "@/api/order.api.js";

const route = useRoute();
const router = useRouter();
const orderId = route.params.orderId;

// Estados
const loading = ref(true);
const paying = ref(false);
const errorMessage = ref('');
const ordenCargada = ref(null);

// Stripe Refs
let stripe = null;
let elements = null;
let cardElement = null;

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 1. Ajuste en la lista para mapear nombres de Java
const listaProductos = computed(() => {
  if (!ordenCargada.value) return [];

  // Buscamos la lista dentro del objeto
  const items = ordenCargada.value.items || ordenCargada.value.orderItems || [];

  return items;
});

// 2. Ajuste en el total (asegurando que encuentre los campos)
const totalVenta = computed(() => {
  return listaProductos.value.reduce((acc, item) => {
    // Intentamos precio, unitPrice (común en Java) o price
    const precio = Number(item.price || item.unitPrice || item.precio || 0);
    // Intentamos quantity o cantidad
    const cantidad = Number(item.quantity || item.cantidad || item.cantidadSeleccionada || 0);
    return acc + (precio * cantidad);
  }, 0);
});

onMounted(async () => {
  loading.value = true;
  try {
    // CAMBIO CLAVE: Axios envuelve la respuesta en .data
    const response = await orderApi.getById(orderId);

    // Según tu log: response.data es el objeto que tiene el id: 42
    ordenCargada.value = response.data || response;

    console.log("Orden procesada:", ordenCargada.value);
  } catch (err) {
    console.error("Error al cargar orden:", err);
    errorMessage.value = "No se pudo cargar la información de la orden.";
  } finally {
    loading.value = false;
  }

  // Inicialización de Stripe
  if (window.Stripe) {
    stripe = Stripe('pk_live_51TKP7p6dth0g5DoErXmm2TvBL3Oeb54yp706mQTUA1RFg5sWSta4C2m1MFG8YCM2t9Q9vFV2H0NEazNRxgvVqdBh00uSghmEpN');
    elements = stripe.elements();
    cardElement = elements.create('card', {
      style: { base: { fontSize: '16px', color: '#32325d' } }
    });
    cardElement.mount('#card-element');
  } else {
    errorMessage.value = "Stripe no pudo cargarse. Revisa tu index.html";
  }
});

const handlePayment = async () => {
  paying.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch(`${BASE_URL}/api/payments/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: orderId })
    });

    if (!response.ok) throw new Error("Error al procesar el pago");

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement }
    });

    if (result.error) {
      errorMessage.value = result.error.message;
    } else if (result.paymentIntent.status === 'succeeded') {
      router.push('/payment-success');
    }
  } catch (err) {
    errorMessage.value = "Error en el servidor de pagos";
  } finally {
    paying.value = false;
  }
};
</script>

<template>
  <div class="checkout-layout">
    <div class="payment-section">
      <div class="content-wrapper">
        <CustomBack />
        <h2 class="title">Finalizar Pago</h2>

        <div class="stripe-container">
          <label class="label">Tarjeta de Crédito o Débito 💳</label>
          <div id="card-element" class="stripe-input"></div>
          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
        </div>

        <CustomButton :label="paying ? 'Procesando...' : 'Pagar Ahora'" @click="handlePayment"
          :disabled="paying || loading" class="btn-pay" />
      </div>
    </div>

    <div class="summary-section">
      <div class="summary-content">
        <h3>Resumen de tu Orden #{{ orderId }}</h3>
        <hr class="divider" />

        <div v-if="loading" class="loading-state">Cargando productos...</div>

        <div v-else-if="listaProductos.length > 0" class="order-items">
          <div v-for="item in listaProductos" :key="item.id" class="item">
            <span>
              {{ item.quantity || item.cantidad || 0 }}x

              {{ (item.product ? item.product.name : '') || item.productName || item.name || item.nombre || 'Producto'
              }}
            </span>

            <span>
              ${{ ((item.price || item.unitPrice || item.precio || 0) * (item.quantity || item.cantidad ||
                0)).toFixed(2) }}
            </span>
          </div>

          <hr class="divider" />

          <div class="total-row">
            <span>Total a pagar</span>
            <span class="total-amount">${{ totalVenta.toFixed(2) }}</span>
          </div>
        </div>

        <div v-else class="empty-state">
          No se encontraron productos en esta orden.
        </div>

        <div class="security-note">
          <p>🔒 Pago protegido con encriptación AES-256.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Columna Izquierda - Pago */
.payment-section {
  flex: 1;
  background-color: #ffffff;
  /* Blanco */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.content-wrapper {
  max-width: 450px;
  width: 100%;
}

/* Columna Derecha - Resumen */
.summary-section {
  flex: 0.8;
  /* Un poco más delgada que la de pago */
  background: linear-gradient(135deg, var(--color-brand-20), var(--color-brand-40));
  /* Tu azul */
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.summary-content {
  max-width: 400px;
  width: 100%;
}

/* Elementos del Stripe */
.stripe-input {
  border: 1px solid #e0e0e0;
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin: 20px 0;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #1a1a1a;
}

.helper-text {
  font-size: 0.9rem;
  color: #666;
}

/* Detalles del resumen */
.divider {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin: 20px 0;
}

.item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  font-weight: bold;
}

.security-note {
  margin-top: 30px;
  font-size: 0.8rem;
  opacity: 0.8;
  text-align: center;
}

/* Responsivo para móviles */
@media (max-width: 768px) {
  .checkout-layout {
    flex-direction: column;
  }

  .summary-section {
    order: -1;
    /* El resumen arriba en móviles */
    flex: none;
    padding: 20px;
  }
}
</style>