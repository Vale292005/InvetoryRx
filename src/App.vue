<script setup>

</script>

<template>
  <router-view v-slot="{Component, route}">
    <transition name="fade" mode="out-in">
      <div :key="route.path">
        <component :is="Component"/>
      </div>
    </transition>
  </router-view>
</template>

<style>
  /* Elimina el margen por defecto del navegador */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    height: 100%;
    overflow-x: hidden; /* Evita desplazamientos laterales raros */
  }

  /* Asegura que el contenedor principal use todo el ancho */
  .login-page {
    margin: 0;
    padding: 0;
    width: 100vw;
    min-height: 100vh;
  }

  /* Transiciones más suaves */
  .fade-enter-active {
    transition: opacity 0.3s ease-in;
  }

  .fade-leave-active {
    transition: opacity 0.2s ease-out;
  }

  .fade-enter-from {
    opacity: 0;
  }

  .fade-leave-to {
    opacity: 0;
  }

  /* Asegura que el componente en transición ocupe el espacio completo */
  .fade-enter-active,
  .fade-leave-active {
    width: 100%;
  }
</style>
