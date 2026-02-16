import {createRouter,createWebHistory} from "vue-router";
import InventoryView from "../views/InventoryView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";


export const router=createRouter({
    history:createWebHistory(),
    routes:[
        {path:'/',redirect:'/Home'},
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