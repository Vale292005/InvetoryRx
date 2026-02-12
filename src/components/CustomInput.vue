<script setup>
defineProps({
  label: String,
  modelValue: String,
  placeholder: { type: String, default: 'Ingrese...' },
  type: { type: String, default: 'text' },
  hasError: { type: Boolean, default: false },
  hasMsg: { type: String, default: '' }
});

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="input-container">
    <label :class="['custom-label','h3',{'label-error':hasError}]">
      {{ label }}
    </label>

    <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue',$event.target.value)"
        :placeholder="placeholder"
        :class="['custom-input','h4',{'input-error':hasError}]"
    />

    <div
        v-if="hasMsg || $slots.msg"
        :class="[
    'input-footer',
    'message-text',
    { 'message-error': hasError }
  ]"
    >
      <slot name="msg">
        {{ hasMsg }}
      </slot>
    </div>

  </div>
</template>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 336px;
  gap: 10px;
}

/* LABEL */
.custom-label {
  color: #355364;
  font-size: 28px;
  font-weight: 700;
}

.label-error {
  color: #5e3333;
}

/* INPUT */
.custom-input {
  width: 100%;
  max-width: 336px;
  height: 50px;
  border-radius: 6px;
  border: 2px solid var(--color-brand-40);
  background-color: #c2d1d9;
  padding: 4px 14px;
  font-size: 1rem;
  color: #334e5e;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.custom-input::placeholder {
  color: var(--color-brand-30);
  font-size: 22px;
}

.input-error {
  border-color: #a87a7a;
  background-color: #d9c2c2;
  color: #7a4a4a;
}

.input-error::placeholder {
  color: #996a6a;
}
.input-footer {
  margin-top: 4px;
  font-size: 16px;
  color: var(--color-brand-50);
}
.input-footer :deep(a) {
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.input-footer :deep(a:hover) {
  text-decoration: underline;
}

.input-footer :deep(svg) {
  width: 14px;
  height: 14px;
  stroke: currentColor;
}


.message-text {
  font-size: 14px;
  color: var(--color-brand-50);
}

.message-error {
  color: #a87a7a;
  font-weight: 500;
}

</style>
