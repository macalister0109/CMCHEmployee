export interface User {
    nombre: string;
    apellido: string;
    user_id: number;
    correo?: string;
}

export interface Empresa {
    id_empresa: number;
    nombre_empresa: string;
    rut_empresa: string;
    correo_empresa?: string;
}

export type UserType = 'user' | 'empresa';

export interface AuthStackProps {
    onLoginSuccess: (type: UserType, data: User | Empresa) => void;
}

export interface AppStackProps {
    userType: UserType;
    userData: User | Empresa;
    onLogout: () => void;
}