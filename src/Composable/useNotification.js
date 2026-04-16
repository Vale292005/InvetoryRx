import {reactive} from "vue";

const state=reactive({
    message:'',
    type:'',
    isVisible:false
})
export function useNotification(){
    const showNotification=(msg,type='success')=>{
        state.message=msg;
        state.type=type;
        state.isVisible=true;

        setTimeout(()=>{
            state.isVisible=false;
        },3000);
    };
    const close=()=>state.isVisible=false;
    return{state,
        notify:showNotification,
        close};
}