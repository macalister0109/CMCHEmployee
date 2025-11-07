import React from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";
import useStyles from "./styles";
import profileCompany from "../../../data/profileCompany.json";
import * as Clipboard from "expo-clipboard";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const styles = useStyles();
    const copiar = () => {
        Clipboard.setStringAsync(profileCompany.email);
    };
    const abrirSitio = () => {
        let url = profileCompany.website;
        // Si el sitio no tiene "http", lo añadimos para evitar errores
        if (!url.startsWith("http")) {
            url = "https://" + url;
        }
        Linking.openURL(url);
    };
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
            <View style={styles.profileContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{profileCompany.name}</Text>
                    <Text style={styles.career}>
                        {profileCompany.sector[0]} y {profileCompany.sector[1]}
                    </Text>
                    <TouchableOpacity onPress={copiar}>
                        <Text style={styles.email}>{profileCompany.email}</Text>
                    </TouchableOpacity>
                    <Text style={styles.location}>
                        {profileCompany.location}
                    </Text>
                    <TouchableOpacity onPress={abrirSitio}>
                        <Text
                            style={[
                                styles.location,
                                { textDecorationLine: "underline" },
                            ]}>
                            {profileCompany.website}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.title}>Descripción</Text>
                    <View style={styles.line}></View>
                    <Text style={styles.textDescription}>
                        {profileCompany.description}
                    </Text>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.title}>Ofertas Publicadas</Text>
                    <View style={styles.line}></View>
                </View>
            </View>
        </View>
    );
}
