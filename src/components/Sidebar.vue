<script setup>
import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
}

const navegation = [
  { name: 'Manager', path: '/manager' },
  { name: 'Ventas', path: '/ventas' },
  { name: 'Bodega', path: '/bodega' }
];

const router = useRouter();
const route = useRoute();

const selected = computed(() => {
  return navegation.find(item=>item.path===route.path)?.name;
});
const handleMenu = (path) => {
  router.push(path)
};

</script>

<template>
  <div class="sidebar" :class="{'sidebar-active':isMenuOpen}">
    <button @click="toggleMenu" class="btn-menu">
      <img src="../assets/menuDesplegable.png" class="img-trigger" alt="Menú"/>
    </button>

    <Transition name="slide-side">

      <div class="options-container" v-if="isMenuOpen">
        <div class="options-text">
              <span
                  v-for="item in navegation"
                  :key="item.name"
                  @click="handleMenu(item.path)"
                  class="menu-item"
                  :class="{'subrayado':selected===item.name}">
        {{ item.name }}
      </span>
        </div>
        <span class="contac-text">Contáctanos</span>
      </div>
    </Transition>
  </div>


</template>

<style scoped>
.sidebar {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: auto;
  height: 100%;
  padding: 10px;
  gap: 10px;
  pointer-events: none;
  margin: 0;
  top: 0;
  left: 0;
}

.sidebar-active {
  background: linear-gradient(to bottom, var(--color-brand-80)0%, var(--color-brand-90)100%);
}

.btn-menu,
.options-container {
  pointer-events: auto;
}

.btn-menu {
  width: 210px;
  height: fit-content;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 20;
}

.options-container {
  display: flex;
  flex-direction: column;
  width: auto;
  height: 100%;
  gap: 10px;
  padding: 0 10px;
  z-index: 15;
}

.slide-side-enter-active,
.slide-side-leave-active {
  transition: transform 0.4s ease, opacity 0.3s ease;
}

.slide-side-enter-from,
.slide-side-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}


.options-text {
  display: flex;
  flex-direction: column;
  height: calc(100% - 65px);
  gap: 10px;
}

.menu-item {
  font-family: arimo, serif;
  font-size: 24px;
  color: var(--color-brand-10);
}

.img-trigger {
  width: 100%;
  height: auto;
  display: block;
}

.subrayado {
  border-bottom: 2px solid var(--color-brand-10);
}

.contac-text {
  cursor: pointer;
  font-family: arimo, serif;
  font-size: 24px;
  color: var(--color-brand-40);
}
</style>