import { View, ScrollView, Text, Image } from "react-native";
import promotions from "../../data/promotions.json";
import { styles } from "./styles";
import InfoCard from "./InfoCard";
import SpecialtyCard from "./SpecialtyCard";
import FooterHome from "./FooterHome";

import GradientBackground from "../GradientBackground";
import { THEME_ESTUDENT } from "../../constants";

const img_Mision = require("../../../assets/logos/image_1.webp");
const img_Vision = require("../../../assets/logos/image_2.webp");
const img_Egresado = require("../../../assets/logos/img_3.webp");

const imgNelson = require("../../../assets/img_contactos/nelson_jofre2025.webp");
const imgErick = require("../../../assets/img_contactos/erick_silva2025.webp");
const imgDaniela = require("../../../assets/img_contactos/daniela_ramirez2025.webp");
const imgOlivi = require("../../../assets/img_contactos/carolina_olivi2025.webp");

const defaultLogo = require("../../../assets/adaptive-icon.png");

const images: Record<string, { logo: any; profile: any }> = {
    administracion_mencion_recursos_humanos: {
        logo: require("../../../assets/especialidades/administracion/img_logo.webp"),
        profile: require("../../../assets/especialidades/administracion/img_profile.webp"),
    },
    electronica: {
        logo: require("../../../assets/especialidades/electronica/img_logo.webp"),
        profile: require("../../../assets/especialidades/electronica/img_profile.webp"),
    },
    construcciones_metalicas: {
        logo: require("../../../assets/especialidades/construcciones_metalicas/img_logo.webp"),
        profile: require("../../../assets/especialidades/construcciones_metalicas/img_profile.webp"),
    },
    gastronomia: {
        logo: require("../../../assets/especialidades/gastronomia/img_logo.webp"),
        profile: require("../../../assets/especialidades/gastronomia/img_profile.webp"),
    },
    conectividad_y_redes: {
        logo: require("../../../assets/especialidades/conectividad_redes/img_logo.webp"),
        profile: require("../../../assets/especialidades/conectividad_redes/img_profile.webp"),
    },
    programacion: {
        logo: require("../../../assets/especialidades/programacion/img_logo.webp"),
        profile: require("../../../assets/especialidades/programacion/img_profile.webp"),
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
                    marginTop: 24,
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
                <View style={styles.PEcontainer}>
                    <Text style={styles.title}>Perfil Egresados</Text>
                    <Text style={styles.description}>
                        {promotions.perfil_egresado.descripcion}
                    </Text>
                    <Image source={img_Egresado} style={styles.img}></Image>
                </View>
                <View style={styles.line}></View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Especialidades</Text>
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
                <View style={styles.line}></View>

                <GradientBackground
                    color={[
                        THEME_ESTUDENT.colors.primary_1,
                        THEME_ESTUDENT.colors.primary_3,
                    ]}>
                    <View style={styles.footer}>
                        <FooterHome
                            name={promotions.contacto.rector.nombre}
                            occupation="RECTOR"
                            image={imgNelson}
                            email={""}
                        />
                        <FooterHome
                            name={promotions.contacto.director_tp.nombre}
                            occupation="DIRECTOR MEDIA TP"
                            image={imgErick}
                            email={promotions.contacto.director_tp.correo}
                        />
                        <FooterHome
                            name={
                                promotions.contacto.orientadora_vocacional_tp
                                    .nombre
                            }
                            occupation="ORIENTADORA VOCACIONAL"
                            image={imgDaniela}
                            email={
                                promotions.contacto.orientadora_vocacional_tp
                                    .correo
                            }
                        />
                        <FooterHome
                            name={promotions.contacto.coordinadora_tp.nombre}
                            occupation="COORDINADORA"
                            image={imgOlivi}
                            email={promotions.contacto.coordinadora_tp.correo}
                        />
                    </View>
                </GradientBackground>
            </View>
        </ScrollView>
    );
}
