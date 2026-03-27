import { reactive, ref } from 'vue';
import { useNotification } from "./useNotification";
import {updateSupplier} from "../api/proveedor";

export const updateSupplierAPI = (supplierData) => {
    return updateSupplier(supplierData.id,supplierData).then(r => r.data);
};

export function useActualizarProveedor() {
    const{notify}=useNotification();
    const getInitialState = () => ({
        id: '',
        code: '',
        name: '',
        email: '',
        active: '',
        build: ''
    });

    const form = reactive(getInitialState());
    const loading = ref(false);
    const error = ref(null);

    const resetForm = () => {
        Object.assign(form, getInitialState());
    };

    const saveProveedor = async () => {
        if (!form.code || !form.name || !form.email || !form.active || !form.build) {
            const msg = "Todos los campos son obligatorios";
            error.value = msg;
            notify(msg, 'error');
            return;
        }
        loading.value = true;
        error.value = null;

        try {
            const data = await updateSupplierAPI(form);
            notify("Proveedor actualizado con exito", "Success");
            console.log("Proveedor actualizado");
            resetForm();
            return data;
        } catch (err) {
            error.value = err;
            notify(err || "Error al actualizar proveedor", "error");
            throw err;
        }
        finally {
            loading.value = false;
        }
    };
    return {
        form,
        loading,
        error,
        saveProveedor,
        resetForm
    };
}