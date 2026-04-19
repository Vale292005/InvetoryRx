import { reactive, ref } from 'vue';
import { updateSupplier } from "../api/proveedor";

export const updateSupplierAPI = (supplierData) => {
    return updateSupplier(supplierData.id, supplierData).then(r => r.data);
};

export function useActualizarProveedor() {
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

    const setProveedorData = (supplier) => {
        supplier.id && (form.id = supplier.id);
        form.code = supplier.code || '';
        form.name = supplier.name || '';
        form.email = supplier.email || '';
        form.contactNumber = supplier.contactNumber || '';
        form.address = supplier.address || '';
        form.active = supplier.active !== undefined ? supplier.active : true;
    };

    const resetForm = () => {
        Object.assign(form, getInitialState());
    };

    const saveProveedor = async () => {
        if (!form.name || !form.email) {
            const msg = "Todos los campos son obligatorios";
            error.value = msg;
            return;
        }
        loading.value = true;
        error.value = null;

        try {
            const data = await updateSupplierAPI(form);
            console.log("Proveedor actualizado");
            resetForm();
            return data;
        } catch (err) {
            error.value = err;
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
        updateProveedor: saveProveedor,
        resetForm,
        setProveedorData
    };
}