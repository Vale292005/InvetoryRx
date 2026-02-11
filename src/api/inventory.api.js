import {PARAM_PARSER_BOOL as axios} from "vue-router/dist/experimental/index.mjs";

export async function getProducts(){
    const response=await axios.get('/api/products')
    return response.data()
}