import {createRouter,createWebHistory} from "vue-router";
import LoginView from "../views/LoginView.vue";
import InventoryView from "../views/InventoryView.vue";


export const router=createRouter({
    history:createWebHistory(),
    routes:[
        {path:'/',redirect:'/login'},
        {path:'/login',component:LoginView},
        {
            path:'/inventory',
            component:InventoryView,
            meta:{requiresAuth:true}
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