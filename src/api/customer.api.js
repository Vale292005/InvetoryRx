// src/api/customers.api.js
import client from './client' // Configuración de axios centralizada

/* ======================
   CRUD BÁSICO
====================== */

// Listar todos los clientes
export function getAllCustomers() {
    return client.get('/customers').then(r => r.data)
}

// Crear un nuevo cliente
export function createCustomer(customerData) {
    return client.post('/customers', customerData).then(r => r.data)
}

// Actualizar un cliente existente
export function updateCustomer(id, customerData) {
    return client.put(`/customers/${id}`, customerData).then(r => r.data)
}

// Obtener cliente por ID
export function getCustomerById(id) {
    return client.get(`/customers/${id}`).then(r => r.data)
}

/* ======================
   BÚSQUEDAS ESPECÍFICAS
====================== */

// Obtener por código interno
export function getCustomerByCode(code) {
    return client.get(`/customers/code/${code}`).then(r => r.data)
}

// Obtener por correo electrónico
export function getCustomerByEmail(email) {
    return client.get(`/customers/email/${email}`).then(r => r.data)
}

// Listar por tipo (Natural, Jurídico, etc.)
export function getCustomersByType(customerType) {
    return client.get(`/customers/type/${customerType}`).then(r => r.data)
}

/* ======================
   ESTADOS Y REPORTES
====================== */

// Listar solo clientes activos
export function getActiveCustomers() {
    return client.get('/customers/status/active').then(r => r.data)
}

// Listar clientes en mora (Morosos)
export function getMorosos() {
    return client.get('/customers/status/morosos').then(r => r.data)
}

/* ======================
   ACCIONES Y CRÉDITO
====================== */

// Activar cliente
export function activateCustomer(id) {
    return client.patch(`/customers/${id}/activate`).then(r => r.data)
}

// Desactivar cliente
export function deactivateCustomer(id) {
    return client.patch(`/customers/${id}/deactivate`).then(r => r.data)
}

// Verificar si tiene crédito disponible para un monto específico
export function hasCreditAvailable(id, amount) {
    return client.get(`/customers/${id}/credit-available/${amount}`).then(r => r.data)
}

// Obtener información de balance (Límite, deuda y saldo disponible)
export function getCustomerBalance(id) {
    return client.get(`/customers/${id}/balance`).then(r => r.data)
}