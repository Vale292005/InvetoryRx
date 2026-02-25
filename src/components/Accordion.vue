<script setup>
import {ref} from "vue";

const props=defineProps({
  title:{type:String,default:'title'},
  text:{type:String,default:'Selecciona una opción'},
  items:{type:Array,default:()=>[]},
  error:{type:Boolean,default:false}
});

const emit=defineEmits(['select']);
const isOpen=ref(false);

const seleccionar=(item)=>{
  emit('select',item);
  isOpen.value=false;
}
</script>

<template>
<div class="accordion-container" :class="{'is-error':error}">
  <text-button class="text-button">{{title}}</text-button>
  <div class="accordion-dropdown">
    <div class="accordion-header" @click="isOpen=!isOpen">
      <text-label>{{text}}</text-label>
      <span :class="{'rotate':isOpen}">⏷</span>
    </div>

    <div v-if="isOpen" class="accordion-content">
      <ul>
        <li v-for="(item,index) in items":key="index"
        @click.stop="seleccionar(item)"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <span v-if="error" class="error-message">Seleccione una opción</span>
  </div>
</div>
</template>

<style scoped>
.accordion-container{
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 336px;
  height: auto;
  gap: 10px;

  color: var(--color-brand-30);
}
.accordion-container text-button{
  font-size: 22px;
}

.accordion-header{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  padding: 8px 10px;
  justify-content: space-around;
  border-radius: 6px;
  box-sizing: border-box;

  background-color: var(--color-brand-80);
  border: 2px solid var(--color-brand-40);
}
.accordion-dropdown{
  position: relative;
  width: 100%;
  gap: 2px;
}
.accordion-content{
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 312px;
  height: auto;
  gap: 2px;
}
.accordion-content ul{
  list-style: none;
  padding: 0;
  margin: 0;
}
.accordion-content li{
  width: 100%;
  height: auto;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  background-color: var(--color-brand-90);
  border: 2px solid var(--color-brand-40);
}
.text-button{
  color: var(--color-brand-30);
}


.is-error text-button{
  color: var(--color-error-30);
}
.is-error .accordion-header{
  color: var(--color-error-30);
  border-color: var(--color-error-40);
  background-color: var(--color-error-80);
}
.is-error .accordion-header{
  color: var(--color-error-30);
  border-color: var(--color-error-40);
  background-color: var(--color-error-80);
}
.is-error .error-message{
  color: var(--color-error-30);
}
</style>