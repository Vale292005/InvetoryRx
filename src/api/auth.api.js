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