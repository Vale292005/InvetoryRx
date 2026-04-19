import client from './client'; // Tu archivo de axios personalizado

export const orderApi = {
    // GET /orders
    getAll: () => client.get('/api/orders'),
    
    // GET /orders/{id}
    getById: (id) => client.get(`/api/orders/${id}`),
    
    // GET /orders/customer/{customerId}
    getByCustomer: (customerId) => client.get(`api//orders/customer/${customerId}`),
    
    // GET /orders/status/{status}
    getByStatus: (status) => client.get(`/api/orders/status/${status}`),
    
    // PATCH /orders/{id}/cancel (Lo que probaste en tu Test)
    cancel: (id) => client.patch(`/api/orders/${id}/cancel`),
    
    // GET /orders/search?startDate=...&endDate=...
    searchByDates: (start, end) => client.get('/api/orders/search', {
        params: { startDate: start, endDate: end }
    }),
    searchByDateRange: (startDate, endDate) => client.get('/api/orders/search', {
    params: { 
        startDate: startDate, // Formato esperado por tu Java: YYYY-MM-DD
        endDate: endDate 
    }
}),
};