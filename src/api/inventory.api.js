// src/api/inventory.api.js
import client from './client' // Importas la configuración centralizada

/* ======================
   CRUD BÁSICO
====================== */

// Listar todos
export function getProducts() {
    return client.get('/api/products').then(r => r.data)
}

// Crear producto
export function createProduct(product) {
    return client.post('/api/products', product).then(r => r.data)
}

// Actualizar producto
export function updateProduct(id, product) {
    return client.put(`/api/products/${id}`, product).then(r => r.data)
}

// Obtener por ID
export function getProductById(id) {
    return client.get(`/api/products/${id}`).then(r => r.data)
}

// Eliminar
export function deleteProduct(id) {
    return client.delete(`/api/products/${id}`).then(r => r.data)
}

/* ======================
   FILTROS Y BÚSQUEDAS
====================== */

// Obtener por código
export function getProductByCode(code) {
    return client.get(`/api/products/code/${code}`).then(r => r.data)
}

// Buscar por nombre
export function searchProducts(name) {
    // Usar params es más profesional que concatenar strings
    return client.get('/api/products/search', { params: { name } }).then(r => r.data)
}

// Listar por categoría
export function getProductsByCategory(category) {
    return client.get(`/api/products/category/${category}`).then(r => r.data)
}

/* ======================
   ACCIONES DE STOCK
====================== */

// Reducir stock
export function reduceStock(id, amount) {
    return client.post(`/api/products/${id}/reduce-stock`, { amount }).then(r => r.data)
}

// Aumentar stock
export function increaseStock(id, amount) {
    return client.post(`/api/products/${id}/increase-stock`, { amount }).then(r => r.data)
}

// Stock bajo (Reporte)
export function getRestockNeeded() {
    return client.get('/api/products/restock-needed').then(r => r.data)
}