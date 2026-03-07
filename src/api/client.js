import axios from 'axios'

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://drogueria-bellavista-api.onrender.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    }
})

client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
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

        return Promise.reject(mensajeAmigable);
    }
);

export default client;