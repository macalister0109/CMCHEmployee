export type LABELS =
    | "Programacion"
    | "Conectividad y Redes"
    | "Construcciones Metalicas"
    | "Gastronomia"
    | "Administracion"
    | "Electronica";

export interface offerDates {
    title: string;
    description: string;
    name: string;
    location: string;
    vacant: string;
    img: string;
    labels: LABELS[];
}
