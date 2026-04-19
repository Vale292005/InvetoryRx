import { useNotification } from "./useNotification";
import { reactive, ref } from "vue";
import { createSupplier } from "../api/proveedor";

export const registerProveedor = (supplierData) => {
    return createSupplier(supplierData).then(r => r.data);
};

export function useCrearProveedor() {
    const { notify } = useNotification();
    const getInitialState = () => ({
        code: '',            // Corresponde a existsByCode
        name: '',            // Nombre comercial
        email: '',           // Corresponde a existsByEmail
        contactNumber: '',   // Teléfono de contacto
        address: '',         // Dirección física
        active: true
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
            const data = await registerProveedor(form);
            notify("Proveedor creado con exito", "Success");
            console.log("Proveedor creado");
            resetForm();
            return data;
        } catch (err) {
            error.value = err;
            notify(err || "Error al crear proveedor", "error");
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