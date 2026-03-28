import client from './client'

/**
 * Servicio de API para Recepción de Mercancía
 */

// Crear una nueva recepción (POST)
export const createGoodsReceipt = (goodsReceiptData) => {
    return client.post('/api/goods-receipts', goodsReceiptData).then(r => r.data)
}

// Confirmar la recepción de mercancía y actualizar stock (POST o PATCH)
export const receiveGoodsReceipt = (id) => {
    return client.post(`/api/goods-receipts/${id}/receive`).then(r => r.data)
}

// Rechazar una recepción pendiente (POST o PATCH)
export const rejectGoodsReceipt = (id) => {
    return client.post(`/api/goods-receipts/${id}/reject`).then(r => r.data)
}

// Obtener una recepción por su ID
export const getGoodsReceiptById = (id) => {
    return client.get(`/api/goods-receipts/${id}`).then(r => r.data)
}

// Obtener una recepción por su número de comprobante (GR-XXXX)
export const getGoodsReceiptByNumber = (receiptNumber) => {
    return client.get(`/api/goods-receipts/number/${receiptNumber}`).then(r => r.data)
}

// Obtener todas las recepciones vinculadas a una orden específica
export const getGoodsReceiptsByOrder = (orderId) => {
    return client.get(`/api/goods-receipts/order/${orderId}`).then(r => r.data)
}

// Obtener recepciones por proveedor
export const getGoodsReceiptsBySupplier = (supplierId) => {
    return client.get(`/api/goods-receipts/supplier/${supplierId}`).then(r => r.data)
}

// Filtrar recepciones por estado (PENDING, RECEIVED, REJECTED)
export const getGoodsReceiptsByStatus = (status) => {
    return client.get(`/api/goods-receipts/status/${status}`).then(r => r.data)
}

// Obtener solo las recepciones en estado PENDING
export const getPendingGoodsReceipts = () => {
    return client.get('/api/goods-receipts/pending').then(r => r.data)
}

// Obtener el listado completo
export const getAllGoodsReceipts = () => {
    return client.get('/api/goods-receipts').then(r => r.data)
}

// Eliminar una recepción (Solo si no ha sido recibida)
export const deleteGoodsReceipt = (id) => {
    return client.delete(`/api/goods-receipts/${id}`).then(r => r.data)
}