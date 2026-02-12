import {defineStore} from "pinia";
import * as authApi from "@/api/auth.api.js";
import {logout} from "@/api/auth.api.js";

export const useAuthStore=defineStore('auth',{
    state:()=>({
        user:null,
        token:localStorage.getItem('auth_token')||null,
        loading:false,
        error:null
    }),
    actions:{
        async login(credentials){
            this.loading=true
            this.error=null
            try{
                const data=await authApi.login(credentials)
                this.token=data.token
                this.user=data.user

                localStorage.setItem('auth_token',data.token)
            }catch (e){
                this.error=e
                throw e
            }finally {
                this.loading=false
            }
        },
        logout(){
            this.user=null
            this.token=null
            localStorage.removeItem('auth_token')
        }
    }
})