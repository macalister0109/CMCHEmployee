import React from "react";
import { View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";
import useStyles from "./styles";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const styles = useStyles();

    return (
        <View style={styles.screen}>
            <Header />

            {/* Banner */}
            <View style={styles.bannerContainer}>
                <Image
                    source={require("../../../../assets/specialties/administracion/banner.webp")}
                    style={styles.imgBanner}
                    resizeMode="cover" // mantiene buena resolución visual
                />

                {/* Imagen de perfil superpuesta */}
                <Image
                    source={require("../../../../assets/specialties/administracion/profile-icon.webp")}
                    style={styles.imgLogo}
                    resizeMode="cover"
                />
            </View>

            {/* Información del usuario */}
            <View style={styles.infoContainer}>
                <Text style={styles.email}>juan@example.com</Text>
                <Text style={styles.location}>Valparaíso, Chile.</Text>
                <Text style={styles.location}>https://techinnovators.cl</Text>
                <Text style={styles.name}>Juan Ignacio Yañez Aravena</Text>
                <Text style={styles.career}>PROGRAMACIÓN</Text>
            </View>
        </View>
    );
}
