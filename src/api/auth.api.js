import client from './client'

export const login=(credentials)=>{
    return client.post('/auth/login',credentials).then(r=>r.data)
}
export const register=(userData)=>{
    return client.post('/auth/register',userData).then(r=>r.data)
}
export const getProfile=()=>{
    return client.get('/auth/profile').then(r=>r.data)
}
export const logout=()=>{
    return client.post('/auth/logout').then(r=>r.data)
}