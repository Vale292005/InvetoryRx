import axios from 'axios'

const client=axios.create({
    basaeURL:import.meta.env.VITE_API_URL||'http://localhost:3000/api',
    timeout:10000,
    headers:{
        'Content-Type':'application/json',
        'Accept':'application/json'
    }
})
client.interceptors.request.use(
    (config)=>{
        const toker=localStorage.getItem('auth_token');
        if(token){
            config.headers.Authoriation=`Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);
client.interceptors.response.use(
    (response)=>{
        return response;
    },
// src/api/client.js (Fragmento del interceptor de respuesta)
    (error) => {
        let mensajeAmigable = "Ocurrió un error inesperado";

        if (!error.response) {
            mensajeAmigable = "No hay conexión con el servidor. Revisa tu internet.";
        } else {
            const status = error.response.status;
            // Aquí personalizas los mensajes según el código HTTP
            if (status === 400) mensajeAmigable = "Los datos enviados son incorrectos.";
            if (status === 401) mensajeAmigable = "Tu sesión ha caducado. Por favor, inicia sesión de nuevo.";
            if (status === 404) mensajeAmigable = "El recurso solicitado no existe.";
            if (status >= 500) mensajeAmigable = "Error en el servidor. Inténtalo más tarde.";
        }

        // En lugar de solo console.log, lanzamos el mensaje limpio
        // Así, en tu Store, this.error será igual a este texto
        return Promise.reject(mensajeAmigable);
    }
);
export default client;