import {defineStore} from 'pinia'
import * as api from '@/api/inventory.api'

export const useInvetoryStore=defineStore('inventory',{
    state:()=>({
        products:[],
        loading:false
    }),
    actions:{
        async fetchProducts(){
            this.loading=true
            this.products=await api.getProducts()
            this.loading=false
        }
    }
})