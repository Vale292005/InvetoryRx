<script setup>

</script>

<template>
  <router-view/>
</template>

<style scoped>
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
</style>
