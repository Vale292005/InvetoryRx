<script setup>
import {ref} from 'vue';
import CustomButton from "@/components/CustomButton.vue";

const hoveredId=ref(null);

const plans=[
  {
    id: 1,
    name: 'Plan Básico',
    price: 0,
    isDefault: false,
    features: [
      'Gestión de 1 sucursal.',
      'Control de entradas y salidas (Inventario).',
      'Alertas de stock mínimo por email.',
      'Reporte de ventas diario.',
      'Soporte estándar por correo.'
    ]
  },
  {
    id: 2,
    name: 'Plan Profesional',
    price: 49,
    isDefault: true,
    features: [
      'Gestión de hasta 3 sucursales.',
      'Sistema completo de Recepción de Mercancía.',
      'Gestión de Clientes y Límites de Crédito.',
      'Roles avanzados (Admin, Manager, Sales, Warehouse).',
      'Auditoría completa de movimientos.'
    ]
  },
  {
    id: 3,
    name: 'Plan Enterprise',
    price: 99,
    isDefault: false,
    features: [
      'Sucursales ilimitadas.',
      'API externa para integración de facturación.',
      'Reportes predictivos de demanda.',
      'Recuperación de contraseña y seguridad avanzada.',
      'Soporte técnico 24/7 con prioridad.'
    ]
  }
]
</script>

<template>
<div class="container">
  <div
    v-for="plan in plans"
    :key="plan.id"
    class="card"
    :class="{
      'card--active':hoveredId===plan.id||(hoveredId===null&&plan.isDefault),
      'card--inactive':hoveredId!==null && hoveredId !== plan.id || (hoveredId === null && !plan.isDefault)
    }"
    @mouseenter="hoveredId=plan.id"
    @mouseleave="hoveredId=null">

    <div class="card__header">
      <h3 class="card__price">${{plan.price}}</h3>
    </div>

    <div class="card__body">
      <ul class="card__list">
        <li v-for="feature in plan.features" :key="feature">
          {{feature}}
        </li>
      </ul>
    </div>

    <custom-button
      label="Comprar"/>
  </div>
</div>
</template>

<style scoped>
*{
  box-sizing: border-box;
}
:root {
  --dark-bg: #121b1e;
  --light-bg: #7fa1b5;
  --button-light: #bdced9;
  --text-white: #ffffff;
  --text-dark: #1a1a1a;
}

.container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 20px;
  min-height: auto;
  box-sizing: border-box;
}

.card {
  width: 338px;
  height: 449px;
  padding: 60px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  cursor: pointer;
  align-items: center;
}

.card__header {
  text-align: center;
}

.card__price {
  font-size: 2.5rem;
  font-weight: bold;
}

.card__body {
  padding: 0 30px 30px;
}

.card__list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
}

.card__list li {
  margin-bottom: 10px;
  position: relative;
  padding-left: 15px;
}

.card__list li::before {
  content: "•";
  position: absolute;
  left: 0;
  font-size: 16px;
}
@media(max-width: 768px){
  .container{
    justify-content: flex-start;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
  .card{
    width: 250px;
    height: 316px;
    scroll-snap-align: center;
    align-items: center;
    justify-content: space-between;
    padding: 20px 10px;
  }
  .card .card__body{
    padding: 0;
  }
  .card .card__price{
    font-size:1.25rem!important;
  }
  .card .card__list{
    font-size: 0.95rem!important;
    line-height: 1.1 !important;
  }
}

/* --- ESTADO ACTIVO (Negro) --- */
.card--active {
  background-color: #121b1e; /* --dark-bg */
  color: white;
  transform: scale(1.05);
  z-index: 2;
  border-top: 20px solid #bdced9;
}

.card--active .card__button {
  background-color: #bdced9; /* --button-light */
  color: #121b1e;
}

/* --- ESTADO INACTIVO (Azul/Gris) --- */
.card--inactive {
  background-color: #7fa1b5; /* --light-bg */
  color: #1a1a1a;
  transform: scale(1);
  border-top: 20px solid #121b1e;
}

.card--inactive .card__button {
  background-color: #121b1e;
  color: white;
}
</style>