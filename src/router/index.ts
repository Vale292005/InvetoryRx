import { createRouter, createWebHistory } from "vue-router";
import InventoryView from "../views/InventoryView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import PerdidaContrasenha from "../views/PerdidaContrasenha.vue";
import confirmContrasenha from "../views/confirmContrasenha.vue";
import pruebas from "../views/pruebas.vue";
import DashboardProducto from "../views/DashboardProducto.vue";
import Register from "../views/Register.vue";
import Order from "../views/Order.vue";
import Manager from "../views/Manager.vue";
import Cliente from "../views/Cliente.vue";
import Activos from "../views/Activos.vue";
import Bodega from "../views/Bodega.vue";
import CheckoutPayment from "../views/CheckoutPayment.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView },
        { path: '/Home', component: HomeView },
        {
            path: '/login',
            component: LoginView,
            meta: { requiresAuth: false }
        },
        {
            path: '/dashboard-producto',
            component: DashboardProducto,
            meta: { requiresAuth: false }
        },
        {
            path: '/orden',
            component: Order,
            meta: { requiresAuth: false }//solo pruebas 
        },
        {
            path: '/cliente',
            component: Cliente,
            meta: { requiresAuth: false }
        },
        {
            path: '/confirmCode',
            component: confirmContrasenha,
            meta: { requiresAuth: false }
        },
        {
            path: '/registro',
            component: Register,
            meta: { requiresAuth: false }
        },
        {
            path: '/manager',
            component: Manager,
            meta: { requiresAuth: false }
        },
        {
            path: '/activos',
            component: Activos,
            meta: { requiresAuth: false }
        },
                {
            path: '/bodega',
            component: Bodega,
            meta: { requiresAuth: false }
        },
        {
            path: '/forgot-password',
            component: PerdidaContrasenha,
            meta: { requiresAuth: false }
        },
        {
            path: '/confirmCode',
            component: confirmContrasenha,
            meta: { requiresAuth: false }
        },
        {
            path: '/pasarela-pago',
            component: CheckoutPayment,
            meta: { requiresAuth: false }
        }
    ]
})
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('auth_token')

    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else {
        next()
    }
})
export default router