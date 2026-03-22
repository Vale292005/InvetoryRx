// src/api/users.api.js
import client from './client' // Importas la configuración centralizada

/* ======================
   CRUD BÁSICO
====================== */

// Listar todos los usuarios
export function getUsers() {
    return client.get('/api/users').then(r => r.data)
}

// Obtener usuario por ID
export function getUserById(id) {
    return client.get(`/api/users/${id}`).then(r => r.data)
}

// Eliminar usuario
export function deleteUser(id) {
    return client.delete(`/api/users/${id}`).then(r => r.data)
}

/* ======================
   GESTIÓN DE ESTADO Y ROLES
====================== */

// Activar/desactivar usuario
// Enviamos el nuevo status (boolean o string según tu backend)
export function updateUserStatus(id, status) {
    return client.patch(`/api/users/${id}/status`, { status }).then(r => r.data)
}

export function updateUserRole(id, roleName) {
    // roleName debe ser 'SALES', 'ADMIN', 'USER', etc.
    // El objeto { role: roleName } equivale al UpdateRoleRequestDTO de Java
    return client.patch(`/users/${id}/role`, { 
        role: roleName 
    }).then(r => r.data);
}