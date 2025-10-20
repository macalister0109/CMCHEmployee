interface PROFESOR_JEFE {
    nombre: string;
    correo: string;
}

export interface specialtyDate {
    nombre: string;
    descripcion: string;
    profesor_jefe: PROFESOR_JEFE;
}
