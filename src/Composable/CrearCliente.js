import { reactive,ref } from "vue";
import {createCustomer as createCustomerApi} from '@/api/customer.api';

export function useCrearCliente(){
    const getInitialState=()=>({
        documentNumber:'',
        firstName:'',
        lastName:'',
        email:''
    });

    const form=reactive(getInitialState());
    const loading=ref(false);
    const error=ref(null);

    const resetForm=()=>{
        Object.assign(form,getInitialState());
    };

    const saveCliente=async()=>{
        if(!form.documentNumber||!form.firstName||!form.lastName||!form.email){
            const msg="Debe completar todos los datos"
            error.value=msg;
            throw new Error(msg);
        }
        loading.value=true;
        error.value=null;

        try{
            const data=await createCustomerApi(form);
            resetForm();
            return data;
        }catch(err){
            error.value=err;
            throw err;
        }finally{
            loading.value=false;
        }
    };

    return {
        form,
        loading,
        error,
        saveCliente,
        resetForm
    };

}