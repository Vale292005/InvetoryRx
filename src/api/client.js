import axios from 'axios'

const client = axios.create({
    // Detecta automáticamente si usa Render o Localhost
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            // CORRECCIÓN: Se escribe "Authorization" (con 'z' y sin saltarse la 'o')
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

client.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        let mensajeAmigable = "Ocurrió un error inesperado";

        if (!error.response) {
            mensajeAmigable = "No hay conexión con el servidor. Revisa tu internet.";
        } else {
            const status = error.response.status;

            // Personalización de mensajes
            if (status === 400) mensajeAmigable = "Los datos enviados son incorrectos.";
            if (status === 401) mensajeAmigable = "Tu sesión ha caducado. Por favor, inicia sesión de nuevo.";
            if (status === 403) mensajeAmigable = "No tienes permisos para realizar esta acción.";
            if (status === 404) mensajeAmigable = "El recurso solicitado no existe.";
            if (status >= 500) mensajeAmigable = "Error en el servidor. Inténtalo más tarde.";

            // Opcional: Si el backend envía un mensaje específico, lo usamos
            if (error.response.data && error.response.data.message) {
                mensajeAmigable = error.response.data.message;
            }
        }

        // Importante: retornamos el error para que los .catch() de tus composables lo lean
        return Promise.reject(mensajeAmigable);
    }
);

export default client;