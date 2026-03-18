import { reactive, ref } from "vue";
import { updateCustomer as updateCustomerApi } from '@/api/customer.api';

export function useActualizarCliente() {
    const form = reactive({
        id: null,
        documentNumber: '',
        firstName: '',
        lastName: '',
        email: ''
    });

    const loading = ref(false);
    const error = ref(null);
    
    const setClienteData = (cliente) => {
        form.id = cliente.id;
        form.documentNumber = cliente.documentNumber;
        form.firstName = cliente.firstName;
        form.lastName = cliente.lastName;
        form.email = cliente.email;
    };

    const updateCliente = async () => {
        if (!form.id) {
            error.value = "Primero debe seleccionar un cliente";
            return;
        }
        loading.value = true;
        try {
            await updateCustomerApi(form.id, form);
            error.value = null;
        } catch (err) {
            error.value = "Error al actualizar el cliente";
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { form, loading, error, updateCliente, setClienteData };
}