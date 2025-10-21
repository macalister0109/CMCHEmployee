import { View, ScrollView, Text, Image } from "react-native";
import promotions from "../../data/promotions.json";
import { styles } from "./styles";
import InfoCard from "./InfoCard";
import SpecialtyCard from "./SpecialtyCard";

const img_Mision = require("../../../assets/logos/image_1.jpg");
const img_Vision = require("../../../assets/logos/image_2.jpg");
const img_Egresado = require("../../../assets/logos/img_3.jpg");

const defaultLogo = require("../../../assets/adaptive-icon.png");

const images: Record<string, { logo: any; profile: any }> = {
    administracion_mencion_recursos_humanos: {
        logo: require("../../../assets/especialidades/administracion/img_logo.jpg"),
        profile: require("../../../assets/especialidades/administracion/img_profile.jpg"),
    },
    electronica: {
        logo: require("../../../assets/especialidades/electronica/img_logo.jpg"),
        profile: require("../../../assets/especialidades/electronica/img_profile.jpg"),
    },
    construcciones_metalicas: {
        logo: require("../../../assets/especialidades/construcciones_metalicas/img_logo.jpg"),
        profile: require("../../../assets/especialidades/construcciones_metalicas/img_profile.jpg"),
    },
    gastronomia: {
        logo: require("../../../assets/especialidades/gastronomia/img_logo.jpg"),
        profile: require("../../../assets/especialidades/gastronomia/img_profile.jpg"),
    },
    conectividad_y_redes: {
        logo: require("../../../assets/especialidades/conectividad_redes/img_logo.jpg"),
        profile: require("../../../assets/especialidades/conectividad_redes/img_profile.jpg"),
    },
    programacion: {
        logo: require("../../../assets/especialidades/programacion/img_logo.jpg"),
        profile: require("../../../assets/especialidades/programacion/img_profile.jpg"),
    },
};

function normalizeKey(str: string) {
    return str
        .normalize("NFD") // separa tildes
        .replace(/[\u0300-\u036f]/g, "") // elimina tildes
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_") // reemplaza espacios por guión bajo
        .replace(/[^a-z0-9_]/g, ""); // elimina caracteres no válidos
}

export default function ShcoolInformation() {
    return (
        <ScrollView style={styles.container}>
            <View
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginVertical: 24,
                }}>
                {/* Misión */}
                <InfoCard
                    img={img_Mision}
                    text={promotions.mision}
                    title="Misión"
                />
                <InfoCard
                    img={img_Vision}
                    text={promotions.vision}
                    title="Visión"
                />
                <View>
                    <Text>Perfil Egresado</Text>
                    <Text>{promotions.perfil_egresado.descripcion}</Text>
                    <Image source={img_Egresado} style={styles.img}></Image>
                </View>
                {promotions.especialidades.map((esp, index) => {
                    const key = normalizeKey(esp.nombre);
                    const imageSet = images[key] ?? {
                        logo: defaultLogo,
                        profile: defaultLogo,
                    };
                    return (
                        <SpecialtyCard
                            key={index}
                            data={esp}
                            imageLogo={imageSet.logo}
                            imageProfile={imageSet.profile}
                        />
                    );
                })}
            </View>
        </ScrollView>
    );
}
