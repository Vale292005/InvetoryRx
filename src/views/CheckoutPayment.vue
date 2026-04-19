<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order.store';
import CustomButton from "@/components/CustomButton.vue";
import CustomBack from "@/components/CustomBack.vue";
import {orderApi} from "@/api/order.api.js";
import { onMounted, ref, computed } from 'vue';

const totalVenta = computed(() => {
  // Si la orden aún no carga o no es una lista, el total es 0
  if (!ordenCargada.value || !Array.isArray(ordenCargada.value)) {
    return 0;
  }
  
  // Sumamos: precio * cantidad de cada item
  return ordenCargada.value.reduce((acc, item) => {
    const precio = Number(item.precio) || 0;
    const cantidad = Number(item.cantidadSeleccionada) || 0;
    return acc + (precio * cantidad);
  }, 0);
});

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const orderId = route.params.orderId;
const loading = ref(false);
const errorMessage = ref('');
const ordenCargada = ref(null);

// Aquí guardaremos la instancia de Stripe
let stripe = null;
let elements = null;
let cardElement = null;

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

onMounted(async () => {
  try{
    ordenCargada.value=await orderApi.getById(orderId);
  }catch (err) {
    errorMessage.value = "No se pudo cargar la información de la orden.";
  }
  if (window.Stripe) {
  // 1. Inicializar Stripe con tu llave pública (la de desarrollo inicia con pk_test)
  stripe = Stripe('pk_live_51TKP7p6dth0g5DoErXmm2TvBL3Oeb54yp706mQTUA1RFg5sWSta4C2m1MFG8YCM2t9Q9vFV2H0NEazNRxgvVqdBh00uSghmEpN'); 
  
  elements = stripe.elements();
  cardElement = elements.create('card', {
    style: {
      base: { fontSize: '16px', color: '#32325d' }
    }
  });

  // 2. Montar el input de la tarjeta en el div con id "card-element"
  cardElement.mount('#card-element');
}else {
    errorMessage.value = "Stripe no pudo cargarse. Revisa tu index.html";
  }
});

const handlePayment = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    // 3. Llamar a tu backend para iniciar el proceso de Stripe
    // Este endpoint debe devolver el client_secret del PaymentIntent
    const response = await fetch(`${BASE_URL}/api/payments/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: orderId })
    });
    
    const { clientSecret } = await response.json();

    // 4. Confirmar el pago con Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement }
    });

    if (result.error) {
      errorMessage.value = result.error.message;
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        // ¡Éxito! Redirigir a la vista de éxito
        router.push('/payment-success');
      }
    }
  } catch (err) {
    errorMessage.value = "Error en el servidor de pagos";
  } finally {
    loading.value = false;
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
          <p class="helper-text">Introduce el número, fecha y CVC de tu tarjeta.</p>
          
          <div id="card-element" class="stripe-input">
            </div>
          
          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
        </div>

        <custom-button 
          :label="loading ? 'Procesando...' : 'Pagar Ahora'" 
          @click="handlePayment"
          :disabled="loading"
          class="btn-pay"
        />
      </div>
    </div>

    <div class="summary-section">
      <div class="summary-content">
        <h3>Resumen de tu Orden #{{ orderId }}</h3>
        <hr class="divider" />
        
        <div class="order-items">
          <div v-for="item in ordenCargada" :key="item.id" class="item">
            <span>{{ item.cantidadSeleccionada }}x {{ item.nombre }}</span>
            <span>${{ (item.precio * item.cantidadSeleccionada).toFixed(2) }}</span>
          </div>
        </div>

        <hr class="divider" />
        
        <div class="total-row">
          <span>Total a pagar</span>
          <span class="total-amount">${{ totalVenta?.toFixed(2) }}</span>
        </div>

        <div class="security-note">
          <p>🔒 Tu pago está protegido con encriptación de nivel bancario (AES-256).</p>
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
  background-color: #ffffff; /* Blanco */
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
  flex: 0.8; /* Un poco más delgada que la de pago */
  background: linear-gradient(135deg, var(--color-brand-20), var(--color-brand-40)); /* Tu azul */
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
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
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
    order: -1; /* El resumen arriba en móviles */
    flex: none;
    padding: 20px;
  }
}
</style>