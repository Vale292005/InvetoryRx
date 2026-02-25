<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <button class="back-circle" @click="goBack" type="button" title="Volver">
    <span class="back-icon">←</span>
  </button>
</template>

<style scoped>
.back-circle {
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.back-circle:hover {
  background-color: #ffffff;
  border-color: #121b1e;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transform: translateX(-4px);
}

.back-icon {
  font-size: 28px;
  color: #121b1e;
  line-height: 1;
}
</style>