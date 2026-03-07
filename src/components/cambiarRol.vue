<script setup>

import CustomInput from "@/components/CustomInput.vue";
import Accordion from "@/components/Accordion.vue";
import CustomButton from "@/components/CustomButton.vue";
import {handleError, ref} from "vue";
import {Roles} from "@/enums/Roles.js";
import {useUserManagement} from "@/Composable/useUserManagement.js";
const { userForm, isEditing, updateRole, clearSelection, loading } = useUserManagement();
const opciones=Object.values(Roles);
const title=ref([
    'Nombre',
    'Nombre del usuario',
    'Email',
    'Email',
    'Rol',
    'Elija un nuevo rol',
    'Aceptar'
])
</script>

<template>
  <div class="container_card">
    <div class="container-form">
      <custom-input
          :label="title[0]"
          :placeholder="title[1]"
          v-model="userForm.username"
      />
      <custom-input
          :label="title[2]"
          :placeholder="title[3]"
          v-model="userForm.email"
      />
      <Accordion
          :title="title[4]"
          :text="userForm.role"
          :items="opciones"
      />
      <CustomButton
          :label="title[5]"
          @click="handleChangeRole"
      />
    </div>
  </div>
</template>

<style scoped>
.container-card{
  display:flex;
  flex-direction: column;
  width: 325px;
  height: auto;
  gap: 10px;
  padding: 16px 24px;
  background: white;
  box-sizing: border-box;
  align-items: center;
}
.container-form{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>