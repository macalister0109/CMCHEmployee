import { LABELS, offerDates } from "./offerDates";

export interface UserProfile {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
    skills: string[];
    experience?: string; // ejemplo: "2 años en desarrollo frontend"
    profileImg?: string;
    banner: string;
    labels: LABELS[]; // reutiliza tus áreas de especialidad
}
export interface CompanyProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location: string;
    description: string;
    website?: string;
    logo?: string;
    banner: string;
    offers: offerDates[]; // relación con tus ofertas laborales
    sector: LABELS[]; // sectores o rubros en los que se desempeña
}
