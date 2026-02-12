import {defineStore} from 'pinia'
import * as api from '@/api/inventory.api'
export const useInvetoryStore = defineStore('inventory', {
    state: () => ({
        products: [],
        loading: false,
        error: null
    }),
    actions: {
        // Un "Helper" privado para manejar el flujo de la API
        async _wrapApiCall(task) {
            this.loading = true
            this.error = null // Limpiar errores previos siempre
            try {
                return await task()
            } catch (e) {
                this.error = e
                throw e // Permitir que el componente reaccione si es necesario
            } finally {
                this.loading = false
            }
        },

        async fetchProducts() {
            await this._wrapApiCall(async () => {
                this.products = await api.getProducts()
            })
        },

        async addProduct(product) {
            await this._wrapApiCall(async () => {
                const newProduct = await api.createProduct(product)
                this.products.push(newProduct)
            })
        },

        async updateProduct(id, productData) {
            await this._wrapApiCall(async () => {
                const updated = await api.updateProduct(id, productData)
                const index = this.products.findIndex(p => p.id === id)
                if (index !== -1) {
                    this.products[index] = { ...this.products[index], ...updated }
                }
            })
        },

        async deleteProduct(id) {
            await this._wrapApiCall(async () => {
                await api.deleteProduct(id)
                this.products = this.products.filter(p => p.id !== id)
            })
        }
    }
})