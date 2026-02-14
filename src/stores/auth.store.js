import { defineStore } from "pinia";
import * as authApi from "@/api/auth.api.js";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('auth_user')) || null,
        token: localStorage.getItem('auth_token') || null,
        loading: false,
        error: null
    }),

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const data = await authApi.login(credentials);

                // Guardar en el estado de Pinia
                this.token = data.token;
                this.user = {
                    id: data.userid,
                    username: data.username,
                    role: data.role
                };

                // GUARDAR CORRECTAMENTE EN LOCALSTORAGE
                localStorage.setItem('auth_token', data.token); // Comas y nombres corregidos
                localStorage.setItem('auth_user', JSON.stringify(this.user)); // setItem corregido

                return data;
            } catch (e) {
                this.error = e;
                throw e;
            } finally {
                this.loading = false;
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
    }
});