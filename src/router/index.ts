import {createRouter,createWebHistory} from "vue-router";
import InventoryView from "../views/InventoryView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import PerdidaContrasenha from "../views/PerdidaContrasenha.vue";
import confirmContrasenha from "../views/confirmContrasenha.vue";
import pruebas from "../views/pruebas.vue";
import DashboardProducto from "../views/DashboardProducto.vue";
import Register from "../views/Register.vue";

export const router=createRouter({
    history:createWebHistory(),
    routes:[
        {path:'/',component:HomeView},
        {path:'/Home',component:HomeView},
        {
            path:'/login',
            component:LoginView,
            meta:{requiresAuth:false}
        },
        {
            path:'/inventory',
            component:InventoryView,
            meta:{requiresAuth:true}
        },
        {
            path:'/dashboard-producto',
            component:DashboardProducto,
            meta:{requiresAuth:true}
        },
        {
            path:'/contrasenhaOlvidada',
            component:PerdidaContrasenha,
            meta:{requiresAuth:false}
        },
        {
            path:'/confirmCode',
            component:confirmContrasenha,
            meta:{requiresAuth:false}
        },
        {
            path:'/registro',
            component:Register,
            meta:{requiresAuth:false}
        }
    ]
})
router.beforeEach((to,from,next)=>{
    const token=localStorage.getItem('auth_token')

    if(to.meta.requiresAuth&&!token){
        next('login')
    }else{
        next()
    }
})
export default router