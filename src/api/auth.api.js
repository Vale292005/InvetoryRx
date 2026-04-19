import client from './client'

export const login=(credentials)=>{
    return client.post('/api/auth/login',credentials).then(r=>r.data)
}
export const register=(userData)=>{
    return client.post('/api/auth/register',userData).then(r=>r.data)
}
export const getProfile=()=>{
    return client.get('/api/auth/profile').then(r=>r.data)
}
export const logout=()=>{
    return client.post('/api/auth/logout').then(r=>r.data)
}
/**
 * Solicitar recuperación de contraseña (envía email)
 * @param {Object} data - { email: '...' }
 */
export const forgotPassword = (data) => {
    return client.post('/api/auth/forgot-password', data).then(r => r.data)
}

/**
 * Restablecer contraseña usando el token recibido por correo
 * @param {Object} data - { token: '...', newPassword: '...' }
 */
export const resetPassword = (data) => {
    return client.post('/api/auth/reset-password', data).then(r => r.data)
}