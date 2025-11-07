import { View, ScrollView, Text, Image } from "react-native";
import promotions from "../../data/promotions.json";
import { useStyles } from "./styles";
import InfoCard from "./AddInfoCard";
import SpecialtyCard from "./EspecialtyCard";
import FooterHome from "./FooterHome";

import GradientBackground from "../GradientBackground";

const img_Mision = require("../../../assets/extraImages/image_1.webp");
const img_Vision = require("../../../assets/extraImages/image_2.webp");
const img_Egresado = require("../../../assets/extraImages/img_3.webp");

const imgNelson = require("../../../assets/contactImages/nelson_jofre2025.webp");
const imgErick = require("../../../assets/contactImages/erick_silva2025.webp");
const imgDaniela = require("../../../assets/contactImages/daniela_ramirez2025.webp");
const imgOlivi = require("../../../assets/contactImages/carolina_olivi2025.webp");

const defaultLogo = require("../../../assets/adaptive-icon.png");

const images: Record<string, { logo: any; profile: any }> = {
    administracion_mencion_recursos_humanos: {
        logo: require("./../../../assets/specialties/administracion/banner.webp"),
        profile: require("../../../assets/specialties/administracion/profile-icon.webp"),
    },
    electronica: {
        logo: require("../../../assets/specialties/electronica/banner.webp"),
        profile: require("../../../assets/specialties/electronica/profile-icon.webp"),
    },
    construcciones_metalicas: {
        logo: require("./../../../assets/specialties/construcciones-metalicas/banner.webp"),
        profile: require("../../../assets/specialties/construcciones-metalicas/profile-icon.webp"),
    },
    gastronomia: {
        logo: require("./../../../assets/specialties/gastronomia/banner.webp"),
        profile: require("../../../assets/specialties/gastronomia/profile-icon.webp"),
    },
    conectividad_y_redes: {
        logo: require("./../../../assets/specialties/conectividad-redes/banner.webp"),
        profile: require("../../../assets/specialties/conectividad-redes/profile-icon.webp"),
    },
    programacion: {
        logo: require("../../../assets/specialties/programacion/banner.webp"),
        profile: require("../../../assets/specialties/programacion/profile-icon.webp"),
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
    const styles = useStyles();

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

                <GradientBackground>
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
