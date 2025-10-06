import { Dimensions } from 'react-native';
type width =
    | "10%"
    | "20%"
    | "30%"
    | "40%"
    | "50%"
    | "60%"
    | "70%"
    | "80%"
    | "90%"
    | "100%";

export const WIDTH: Record<width, number> = {
    "10%": 0.1,
    "20%": 0.2,
    "30%": 0.3,
    "40%": 0.4,
    "50%": 0.5,
    "60%": 0.6,
    "70%": 0.7,
    "80%": 0.8,
    "90%": 0.9,
    "100%": 1,
};


// Obtiene el ancho de la pantalla UNA SOLA VEZ al iniciar la app
export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;

export const BASE_WIDTH = 375; // Por ejemplo, el ancho de un iPhone SE

export const scale = (size: number): number => (DEVICE_WIDTH / BASE_WIDTH) * size;