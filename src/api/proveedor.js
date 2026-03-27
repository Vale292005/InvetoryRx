import client from "./client";

export function createSupplier() {
    return client.post('/suppliers').then(r => r.data);
}

export function updateSupplier(id, supplierData) {
    return client.post(`/suppliers/${id}`, supplierData).then(r => r.data);
}
export function getSupplierById(id){
    return client.get('/suppliers/${id}').then(r => r.data);
}
export function getAllSuppliers(){
    return client.get('/suppliers').then(r => r.data);
}
export function getActiveSuppliers(){
    return client.get('/suppliers/status/active').then(r=>r.data);
}
export function deactivateSupplier(id){
    return client.patch('/suppliers/{id}/deactivate').then(r=>r.data);
}
export function activateSupplier(id){
    return client.patch('/suppliers/{id}/activate').then(r=>r.data);
}