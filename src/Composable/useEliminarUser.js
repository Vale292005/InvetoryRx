import { deleteUser } from "../api/user";
import { reactive, ref } from "vue";
import { useNotification } from "./useNotification";

export function deleteUserAPI(id) {
    return deleteUser(id);
}

export function useEliminarUsuario(){
    const notify=useNotification();
    const getInitialState = () => ({
        id: '',
        username: '',
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        role: 'USER'
    });
    const form = reactive(getInitialState());
    const setUserData = (user) => {
        form.id = user.id;
        form.username = user.username;
        form.email = user.email;
        form.password = '';
        form.firstname = user.firstname;
        form.lastname = user.lastname;
        form.role = user.role;
    };
    const loading = ref(false);
    const error = ref(null);

    const resetForm = () => {
        Object.assign(form, getInitialState());
    };

    const eliminarUsuario = async () => {

        if(!form.id){
            const msg = "Seleccione un usuario para eliminar";
            error.value = msg;
            notify(msg, 'error');
            return;
        };

        loading.value = true;
        error.value = null;

        try {
            await deleteUserAPI(form.id);
            notify("Usuario eliminado con exito", "success");
            console.log("Usuario eliminado");
            resetForm();
        } catch (err) {
            error.value = err;
            notify(err || "Error al eliminar usuario", "error");
            throw err;
        } finally {
            loading.value = false;
        }
    };
    return {
        form,
        loading,
        error,
        setUserData,
        eliminarUsuario,
        resetForm
    };
}