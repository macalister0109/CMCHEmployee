interface PROFESOR_JEFE {
    nombre: string;
    correo: string;
}
export interface IMAGES {
    img_logo: any;
    img_profile: any;
}
export interface specialtyDate {
    nombre: string;
    descripcion: string;
    profesor_jefe: PROFESOR_JEFE;
}
