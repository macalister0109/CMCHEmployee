// API Configuration
export const API_URL = 'http://10.0.2.2:5000'; // Para Android emulator usando localhost del host
// export const API_URL = 'http://localhost:5000'; // Para iOS simulator
// export const API_URL = 'https://tu-dominio.com'; // Para producción

// API Endpoints
export const ENDPOINTS = {
    // Auth
    LOGIN: '/login',
    LOGIN_EMPRESA: '/login_empresa',
    REGISTER: '/register',
    REGISTER_EMPRESA: '/register_empresa',
    LOGOUT: '/logout',
    
    // Empresas
    EMPRESA_PROFILE: '/profile-empresa',
    
    // Usuarios
    USER_PROFILE: '/profile',
    
    // Postulaciones
    POSTULACIONES: '/postulaciones',
    PUESTOS: '/puestos',
    
    // Búsqueda
    SEARCH: '/busqueda',
};