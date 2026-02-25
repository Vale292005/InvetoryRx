<script setup>
import {ref} from "vue";

const props=defineProps({
  title:{type:String, default:'Buscar...'},
  placeholder:{type:String, default: 'Buscar...'},
});
const emit=defineEmits(['update:search']);

const query=ref('');

const onInput=()=>{
  emit('update:search',query.value);
};
</script>

<template>
<div class="search-container">
  <text-button v-if="title" class="text-button">{{props.title}}</text-button>

  <input
    type="text"
    v-model="query"
    class="custom-input"
    :placeholder="placeholder"
    @input="onInput"/>
</div>
</template>

<style scoped>
.search-container{
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 336px;
  height: auto;
  gap: 10px;
}
.text-button {
  color: var(--color-brand-30);
}
.custom-input{
  display: flex;
  width: 100%;
  height: auto;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--color-brand-80);
  border: 2px solid var(--color-brand-40);
  box-sizing: border-box;
}
.custom-input::placeholder{
  color: var(--color-brand-30);
  font-size: 16px;
}
</style>