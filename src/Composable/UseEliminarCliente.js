// import { reactive, ref } from "vue";
// import { deleteCustomer as deleteCustomerApi } from '@/api/customer.api';

// export function eliminarCliente() {
//     const clienteParaEliminar = ref(null);
//     const loading = ref(false);
//     const error = ref(null);

//     const setClienteAEliminar = (cliente) => {
//         clienteParaEliminar.value = cliente;
//     };

//     const deleteCliente = async () => {
//         if (!clienteParaEliminar.value?.id) {
//             error.value = "No hay un cliente seleccionado";
//             return;
//         }
//         loading.value = true;
//         try {
//             await deleteCustomerApi(clienteParaEliminar.value.id);
//             clienteParaEliminar.value = null; 
//             error.value = null;
//         } catch (err) {
//             error.value = "Error al intentar eliminar el cliente";
//             throw err;
//         } finally {
//             loading.value = false;
//         }
//     };

//     return { clienteParaEliminar, loading, error, deleteCliente, setClienteAEliminar };
// }