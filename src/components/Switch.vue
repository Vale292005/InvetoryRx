<script setup>
const props = defineProps({
  title: { type: String, default: 'Activar/Desactivar' },
  modelValue: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: 'error' }
});
const emit = defineEmits(['update:modelValue']);

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
}
</script>

<template>
  <div class="switch-container" :class="{ 'has-error': error }">
    <div class="switch-row">
      <text-button class="text-button">{{ title }}</text-button>
      <div
          class="switch-track"
          :class="{ 'is-active': modelValue }"
          @click.stop="toggle"
      >
        <div class="switch-handle"></div>
      </div>
    </div>
    <Transition name="fade">
      <span v-if="error" class="error-text">{{ errorMessage }}</span>
    </Transition>
  </div>
</template>

<style scoped>
.switch-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  touch-action: manipulation;
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-button{
  color: var(--color-brand-30);
}

.switch-track {
  width: 52px;
  height: 28px;
  background-color: #1a202c;
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  transform: translateZ(0);
  transition: background-color 0.2s ease;
}

.switch-handle {
  width: 22px;
  height: 22px;
  background-color: #b9ceda;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 4px;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease;
  will-change: transform;
}

.is-active .switch-handle {
  transform: translateX(22px);
}

.has-error .switch-label { color: #4a1d1d; }
.has-error .switch-track { background-color: #2d1616; }
.has-error .switch-handle { background-color: #e2b6b6; }

.error-text {
  color: #4a1d1d;
  font-weight: bold;
  font-size: 0.95rem;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s linear; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>