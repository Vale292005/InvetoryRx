<script setup>
defineProps({
  label:{type:String, default:'Button'},
  type:{
    type:String,
    default:'default',
    validator:(value)=>['default','hover','disable'].includes(value)
  }
});
</script>

<template>
<button :class="['custom-button',type]">
  {{label}}
</button>
</template>

<style scoped>
.custom-button{
  width: auto!important;
  height: auto!important;

  padding: 10px 60px;

  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  /*---Default---*/
  background-color: #588AA7;
  color: #ffffff;
  font-weight: 700;
  font-size: 26px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 4px 4px 0px #000,0 6px 8px rgba(0,0,0,0.15);
}
@media (max-width: 768px){
  .custom-button{
    font-size: 20px;
    padding: 8px 20px;
    box-shadow: 3px 3px 0px #000;
  }
}
.custom-button:hover{
  background-color: #BCD0DC;
  border-bottom-color: #588AA7;
}
.custom-button:active,
.custom-button:disabled {
  background-color: #3e5a69;
  transform: translateY(3px);
  box-shadow: 0 1px 0px #2c414d;
}

.button-text {
  /* Asegura que el texto no se desplace */
  line-height: 1;
}
</style>