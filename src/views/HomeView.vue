<script setup>

import CustomButton from "@/components/CustomButton.vue";
import CustomCard from "@/components/CustomCard.vue";
import {onMounted, onUnmounted, ref} from "vue";
import router from "@/router/index.js";

const goToLogin=()=>{
  router.push('/login');
}

const index=ref('');
let interval=null;

function moveCarousel(){
  if(index.value>=1){
    index.value=0;
  }else{
    index.value++;
  }
}
onMounted(()=>{
  interval=setInterval(moveCarousel,3000);
});
onUnmounted(()=>{
  clearInterval(interval);
});
</script>

<template>
<div class="homeView">
  <div class="menu">
    <img src="../assets/meuDesplegable.png" alt="iconoMenu"/>

    <div class="container-button">
      <CustomButton
          label="Registarse"
          type="default"/>
      <CustomButton
          @click="goToLogin"
          label="Iniciar sesión"
          type="default"/>
    </div>
  </div>

  <div class="carousel-container">
    <div
        class="carousel-track"
        :style="{transform: `translateX(-${index*100}%`}"
    >
      <img src="../assets/simi1.png">
      <img src="../assets/simi2.png">
    </div>
  </div>

  <div class="container-parraf">
    <div class="title">
      <h1>FarmaClick</h1>
    </div>
    <div class="container-description">
      <h3>"Somos una solución tecnológica especializada en la gestión de stocks para el sector salud. Ofrecemos una infraestructura de inventario flexible, creada por y para farmacias, que se adapta a tu volumen de operación y te permite optimizar el control de tus suministros de forma inteligente."</h3>
    </div>
  </div>

  <div class="container-cards">
    <CustomCard/>
  </div>

  <div class="container-phrase">
    <div class="container-text">
      <h3>"La inteligencia detrás de tu mostrador: Gestión de inventario que entiende el ritmo de tu farmacia."</h3>
    </div>
  </div>
</div>
</template>

<style scoped>
.homeView{
  background-color: var(--color-brand);
}
.menu{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px 20px;
  background-color: #DEE8ED;
}
.menu img{
  width: auto;
  max-width: 281px;
  height: auto;
  object-fit: contain;
  padding: 0;
}
.container-button{
  display: flex;
  flex-direction: row;
  width: auto;
  height: auto;
  gap: 15px;
}

.carousel-container{
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;
}
.carousel-track{
  display: flex;
  width: 100%;
  height: auto;
  transition: transform 0.5s ease-in-out;
}
.carousel-track img{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.container-parraf {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 0;
}
.title{
  display: flex;
  height: 200px;
  align-items: center;
  justify-content: center;
}
.title h1{
  font-family: arimo, serif;
  font-weight: bold;
  font-size: 128px;
  color: #DEE8ED;
  text-align: center;
}
.container-description{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.container-description h3{
  padding: 0 200px;
  font-family: arimo, serif;
  font-size: 22px;
  color: #c2d1d9;
  font-weight: normal;
}

.container-phrase{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 160px 0;
}
.container-text{
  width: 1100px;
  height: auto;
  background-color: #121b1e;
  padding: 60px;
}
.container-text h3{
  font-family: arimo, serif;
  font-weight: bold;
  font-size: 28px;
  font-style: italic;
  color: #c2d1d9;
}
/* Para Chrome, Safari y Opera */
.homeView::-webkit-scrollbar {
  display: none;
}

/* Para Firefox y IE/Edge */
.homeView {
  -ms-overflow-style: none;  /* IE y Edge */
  scrollbar-width: none;     /* Firefox */
}
@media (max-width: 768px) {
  /* El menú apila el logo y los botones */
  .menu {
    flex-direction: column;
    gap: 15px;
    align-items: center;
    text-align: center;
  }

  /* El título gigante baja a un tamaño razonable */
  .title h1 {
    font-size: 60px; /* De 128px a 60px para que no se salga */
  }

  /* Quitamos el padding exagerado de 200px que rompe el móvil */
  .container-description h3 {
    padding: 0 20px;
    font-size: 18px;
  }

  /* La frase negra deja de medir 1100px y ocupa el ancho de la pantalla */
  .container-text {
    width: 90%;
    padding: 30px;
  }

  .container-text h3 {
    font-size: 20px;
  }

  .container-phrase {
    padding: 80px 0;
  }
}
</style>