import { defineStore } from 'pinia';
import client from '../api/client.js';

export const useOrderStore = defineStore('order', {
    state: () => ({
        loading: false,
    }),
    actions: {
        async createOrder(orderData) {
            this.loading = true;
            try {
                // Tu cliente ya tiene la baseURL y el Token, así que solo pides el endpoint
                const response = await client.post('/orders', orderData);
                return response.data;
            } catch (error) {
                // 'error' aquí ya es el 'mensajeAmigable' que configuraste en el interceptor
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});