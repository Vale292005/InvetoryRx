import client from "./client";

export function createSupplier(supplierData) {
    return client.post('/api/suppliers', supplierData).then(r => r.data);
}

export function updateSupplier(id, supplierData) {
    return client.put(`/api/suppliers/${id}`, supplierData).then(r => r.data);
}
export function getSupplierById(id){
    return client.get('/api/suppliers/${id}').then(r => r.data);
}
export function getAllSuppliers(){
    return client.get('/api/suppliers').then(r => r.data);
}
export function getActiveSuppliers(){
    return client.get('/api/suppliers/status/active').then(r=>r.data);
}
export function deactivateSupplier(id){
    return client.patch('/api/suppliers/{id}/deactivate').then(r=>r.data);
}
export function activateSupplier(id){
    return client.patch('/api/suppliers/{id}/activate').then(r=>r.data);
}