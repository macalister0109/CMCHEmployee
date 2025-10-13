// Configuración de la URL base del API
const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:5000'  // Android emulator apunta a localhost de tu PC
  : 'http://192.168.1.100:5000';  // Reemplaza con tu IP local o servidor

// Tipos de respuesta
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse {
  message: string;
  user?: {
    nombre: string;
    apellido: string;
    user_id: number;
  };
}

export interface RegisterResponse {
  message: string;
  bienvenida?: string;
  aviso?: string;
}

/**
 * Servicio de API para comunicación con el backend
 */
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Método genérico para hacer peticiones HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      console.log(`📡 Response Status: ${response.status}`);

      // Si la respuesta es HTML (redirect o error page), intentar parsear el error
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('text/html')) {
        const html = await response.text();
        // Intentar extraer mensaje de error del HTML
        const errorMatch = html.match(/<div class="error">(.*?)<\/div>/);
        const errorMessage = errorMatch ? errorMatch[1] : 'Error en el servidor';
        
        return {
          success: false,
          error: errorMessage,
        };
      }

      // Intentar parsear JSON
      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = {};
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || `Error ${response.status}`,
          data,
        };
      }

      return {
        success: true,
        data,
        message: data.message || data.bienvenida,
      };
    } catch (error) {
      console.error('❌ API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
      };
    }
  }

  /**
   * Login de usuario
   */
  async login(rut: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ rut, password }),
    });
  }

  /**
   * Registro de estudiante
   */
  async registerStudent(data: {
    rut: string;
    nombre: string;
    apellido: string;
    password: string;
  }): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Registro de empresa
   */
  async registerCompany(data: {
    nombre_empresa: string;
    rut_empresa: string;
    email: string;
    password: string;
    direccion?: string;
    rubro?: string;
    sitio_web?: string;
  }): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>('/register_empresa', {
      method: 'POST',
      body: JSON.stringify({
        nombre_empresa: data.nombre_empresa,
        rut_empresa: data.rut_empresa,
        email: data.email,
        password: data.password,
        direccion: data.direccion || 'No especificada',
        rubro: data.rubro || 'No especificado',
        sitio_web: data.sitio_web || '-',
      }),
    });
  }

  /**
   * Login de empresa
   */
  async loginCompany(rut_empresa: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/login_empresa', {
      method: 'POST',
      body: JSON.stringify({ rut_empresa, password }),
    });
  }

  /**
   * Obtener lista de empresas
   */
  async getEmpresas(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/empresas', {
      method: 'GET',
    });
  }

  /**
   * Obtener lista de puestos de trabajo
   */
  async getPuestos(empresaId?: number): Promise<ApiResponse<any[]>> {
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
}

// Exportar instancia única del servicio
export const apiService = new ApiService();
export default apiService;
