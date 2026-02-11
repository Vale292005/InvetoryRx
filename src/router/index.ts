import {createRouter,createWebHistory} from "vue-router";
import InventoryView from "../views/InventoryView.vue";

export const router=createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            name:'Inventory',
            component:InventoryView
        }
    ]
})
export default router