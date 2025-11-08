import { API_URL, ENDPOINTS } from '../config/api';// Configuración de la URL base del API

import AsyncStorage from '@react-native-async-storage/async-storage';const API_BASE_URL = __DEV__ 

  ? 'http://10.0.2.2:5000'  // Android emulator apunta a localhost de tu PC

// Tipos  : 'http://192.168.1.100:5000';  // Reemplaza con tu IP local o servidor

export interface LoginResponse {

    success: boolean;// Tipos de respuesta

    message?: string;export interface ApiResponse<T = any> {

    user?: {  success: boolean;

        nombre: string;  data?: T;

        apellido: string;  error?: string;

        user_id: number;  message?: string;

    };}

    empresa?: {

        id_empresa: number;export interface LoginResponse {

        nombre_empresa: string;  message: string;

        rut_empresa: string;  user?: {

    };    nombre: string;

    error?: string;    apellido: string;

}    user_id: number;

  };

export interface APIError {}

    success: false;

    error: string;export interface RegisterResponse {

}  message: string;

  bienvenida?: string;

// Cliente API base  aviso?: string;

const apiClient = async (endpoint: string, options: RequestInit = {}) => {}

    try {

        const url = `${API_URL}${endpoint}`;/**

        const response = await fetch(url, { * Servicio de API para comunicación con el backend

            ...options, */

            headers: {class ApiService {

                'Content-Type': 'application/json',  private baseURL: string;

                ...options.headers,

            },  constructor(baseURL: string = API_BASE_URL) {

        });    this.baseURL = baseURL;

  }

        const data = await response.json();

          /**

        if (!response.ok) {   * Método genérico para hacer peticiones HTTP

            throw new Error(data.error || 'Error en la solicitud');   */

        }  private async request<T>(

            endpoint: string,

        return data;    options: RequestInit = {}

    } catch (error) {  ): Promise<ApiResponse<T>> {

        console.error('API Error:', error);    try {

        throw error;      const url = `${this.baseURL}${endpoint}`;

    }      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

};

      const response = await fetch(url, {

// Servicios de autenticación        ...options,

export const authService = {        headers: {

    // Login normal          'Content-Type': 'application/json',

    login: async (rut: string, password: string): Promise<LoginResponse> => {          ...options.headers,

        try {        },

            const response = await apiClient(ENDPOINTS.LOGIN, {      });

                method: 'POST',

                body: JSON.stringify({ rut, password }),      console.log(`📡 Response Status: ${response.status}`);

            });

                  // Si la respuesta es HTML (redirect o error page), intentar parsear el error

            if (response.success) {      const contentType = response.headers.get('content-type');

                await AsyncStorage.setItem('isLoggedIn', 'true');      if (contentType?.includes('text/html')) {

                await AsyncStorage.setItem('userType', 'user');        const html = await response.text();

                await AsyncStorage.setItem('userData', JSON.stringify(response.user));        // Intentar extraer mensaje de error del HTML

            }        const errorMatch = html.match(/<div class="error">(.*?)<\/div>/);

                    const errorMessage = errorMatch ? errorMatch[1] : 'Error en el servidor';

            return response;        

        } catch (error) {        return {

            throw error;          success: false,

        }          error: errorMessage,

    },        };

      }

    // Login empresa

    loginEmpresa: async (rut_empresa: string, password: string): Promise<LoginResponse> => {      // Intentar parsear JSON

        try {      let data;

            const response = await apiClient(ENDPOINTS.LOGIN_EMPRESA, {      try {

                method: 'POST',        const text = await response.text();

                body: JSON.stringify({ rut_empresa, password }),        data = text ? JSON.parse(text) : {};

            });      } catch (e) {

                    data = {};

            if (response.success) {      }

                await AsyncStorage.setItem('isLoggedIn', 'true');

                await AsyncStorage.setItem('userType', 'empresa');      if (!response.ok) {

                await AsyncStorage.setItem('empresaData', JSON.stringify(response.empresa));        return {

            }          success: false,

                      error: data.error || data.message || `Error ${response.status}`,

            return response;          data,

        } catch (error) {        };

            throw error;      }

        }

    },      return {

        success: true,

    // Logout        data,

    logout: async () => {        message: data.message || data.bienvenida,

        try {      };

            await apiClient(ENDPOINTS.LOGOUT, { method: 'POST' });    } catch (error) {

            await AsyncStorage.clear();      console.error('❌ API Error:', error);

        } catch (error) {      return {

            console.error('Error en logout:', error);        success: false,

            // Limpiar storage aunque falle la API        error: error instanceof Error ? error.message : 'Error de conexión con el servidor',

            await AsyncStorage.clear();      };

        }    }

    },  }

};

  /**

// Servicio de empresas   * Login de usuario

export const empresaService = {   */

    getProfile: async () => {  async login(rut: string, password: string): Promise<ApiResponse<LoginResponse>> {

        try {    return this.request<LoginResponse>('/login', {

            return await apiClient(ENDPOINTS.EMPRESA_PROFILE);      method: 'POST',

        } catch (error) {      body: JSON.stringify({ rut, password }),

            throw error;    });

        }  }

    },

  /**

    updateProfile: async (data: any) => {   * Registro de estudiante

        try {   */

            return await apiClient(ENDPOINTS.EMPRESA_PROFILE, {  async registerStudent(data: {

                method: 'POST',    rut: string;

                body: JSON.stringify(data),    nombre: string;

            });    apellido: string;

        } catch (error) {    password: string;

            throw error;  }): Promise<ApiResponse<RegisterResponse>> {

        }    return this.request<RegisterResponse>('/register', {

    },      method: 'POST',

};      body: JSON.stringify(data),

    });

// Servicio de usuarios  }

export const userService = {

    getProfile: async () => {  /**

        try {   * Registro de empresa

            return await apiClient(ENDPOINTS.USER_PROFILE);   */

        } catch (error) {  async registerCompany(data: {

            throw error;    nombre_empresa: string;

        }    rut_empresa: string;

    },    email: string;

    password: string;

    updateProfile: async (data: any) => {    direccion?: string;

        try {    rubro?: string;

            return await apiClient(ENDPOINTS.USER_PROFILE, {    sitio_web?: string;

                method: 'POST',  }): Promise<ApiResponse<RegisterResponse>> {

                body: JSON.stringify(data),    return this.request<RegisterResponse>('/register_empresa', {

            });      method: 'POST',

        } catch (error) {      body: JSON.stringify({

            throw error;        nombre_empresa: data.nombre_empresa,

        }        rut_empresa: data.rut_empresa,

    },        email: data.email,

};        password: data.password,

        direccion: data.direccion || 'No especificada',

// Servicio de postulaciones        rubro: data.rubro || 'No especificado',

export const postulacionService = {        sitio_web: data.sitio_web || '-',

    getPostulaciones: async () => {      }),

        try {    });

            return await apiClient(ENDPOINTS.POSTULACIONES);  }

        } catch (error) {

            throw error;  /**

        }   * Login de empresa

    },   */

  async loginCompany(rut_empresa: string, password: string): Promise<ApiResponse<LoginResponse>> {

    getPuestos: async () => {    return this.request<LoginResponse>('/login_empresa', {

        try {      method: 'POST',

            return await apiClient(ENDPOINTS.PUESTOS);      body: JSON.stringify({ rut_empresa, password }),

        } catch (error) {    });

            throw error;  }

        }

    },  /**

};   * Obtener lista de empresas

   */

// Servicio de búsqueda  async getEmpresas(): Promise<ApiResponse<any[]>> {

export const searchService = {    return this.request<any[]>('/api/empresas', {

    search: async (query: string) => {      method: 'GET',

        try {    });

            return await apiClient(`${ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`);  }

        } catch (error) {

            throw error;  /**

        }   * Obtener lista de puestos de trabajo

    },   */

};  async getPuestos(empresaId?: number): Promise<ApiResponse<any[]>> {
    const endpoint = empresaId 
      ? `/api/puestos?empresa_id=${empresaId}`
      : '/api/puestos';
    
    return this.request<any[]>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Postular a un puesto
   */
  async postular(jobId: number): Promise<ApiResponse<any>> {
    return this.request(`/postular/${jobId}`, {
      method: 'POST',
    });
  }

  /**
   * Obtener mis postulaciones
   */
  async getMisPostulaciones(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/mis_postulaciones', {
      method: 'GET',
    });
  }

  /**
   * Logout
   */
  async logout(): Promise<ApiResponse<any>> {
    return this.request('/logout', {
      method: 'POST',
    });
  }

  // ========================================
  // GESTIÓN DE PUESTOS (EMPRESAS)
  // ========================================

  /**
   * Crear nuevo puesto de trabajo
   */
  async crearPuesto(data: {
    empresa_id: number;
    area_trabajo: string;
    region_trabajo: string;
    comuna_trabajo: string;
    modalidad_trabajo: string;
    tipo_industria: string;
    tamanio_empresa: string;
    descripcion_trabajo: string;
    calificaciones?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/api/puesto', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Editar puesto existente
   */

  async editarPuesto(id: number, data: {
    empresa_id?: number;
    area_trabajo?: string;
    region_trabajo?: string;
    comuna_trabajo?: string;
    modalidad_trabajo?: string;
    tipo_industria?: string;
    tamanio_empresa?: string;
    descripcion_trabajo?: string;
    calificaciones?: string;
  }): Promise<ApiResponse<any>> {
    return this.request(`/api/puesto/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Eliminar puesto
   */

  async eliminarPuesto(id: number, empresaId: number): Promise<ApiResponse<any>> {
    return this.request(`/api/puesto/${id}?empresa_id=${empresaId}&format=json`, {
      method: 'DELETE',
    });
  }

  /**
   * Ver postulantes a un puesto
   */

  async verPostulantes(puestoId: number, empresaId: number): Promise<ApiResponse<any>> {
    return this.request(`/api/puesto/${puestoId}/postulantes?empresa_id=${empresaId}`, {
      method: 'GET',
    });
  }

  /**
   * Cambiar estado de postulación
   */

  async cambiarEstadoPostulacion(postulacionId: number, estado: string, empresaId: number): Promise<ApiResponse<any>> {
    return this.request(`/api/postulacion/${postulacionId}`, {
      method: 'PUT',
      body: JSON.stringify({ estado, empresa_id: empresaId }),
    });
  }

  /**
   * Obtener mis puestos (empresa autenticada)
   */
  
  async getMisPuestosEmpresa(empresaId: number): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/api/empresa/mis-puestos?empresa_id=${empresaId}`, {
      method: 'GET',
    });
  }

  // ========================================
  // BÚSQUEDA
  // ========================================

  /**
   * Buscar ofertas laborales
   */
  
  async buscarOfertas(filtros: {
    q?: string;          // Texto de búsqueda
    region?: string;     // Región
    modalidad?: string;  // Modalidad de trabajo
    area?: string;       // Área de trabajo
  }): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (filtros.q) params.append('q', filtros.q);
    if (filtros.region) params.append('region', filtros.region);
    if (filtros.modalidad) params.append('modalidad', filtros.modalidad);
    if (filtros.area) params.append('area', filtros.area);

    const queryString = params.toString();
    const endpoint = queryString ? `/api/buscar?${queryString}` : '/api/buscar';

    return this.request(endpoint, {
      method: 'GET',
    });
  }
}

// Exportar instancia única del servicio
export const apiService = new ApiService();
export default apiService;
