import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";
import useStyles from "./styles";
import profileStudent from "../../../data/profileStudent.json";
import * as Clipboard from "expo-clipboard";
export default function ProfileScreen() {
    const navigation = useNavigation();
    const styles = useStyles();
    const copiar = () => {
        Clipboard.setStringAsync(profileStudent.email);
    };
    return (
        <View style={styles.screen}>
            <Header />
            <ScrollView>
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
                        <Text style={styles.name}>{profileStudent.name}</Text>
                        <Text style={styles.career}>
                            {profileStudent.labels}
                        </Text>
                        <TouchableOpacity onPress={copiar}>
                            <Text style={styles.email}>
                                {profileStudent.email}
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.location}>
                            {profileStudent.location}
                        </Text>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>Sobre mí</Text>
                        <View style={styles.line}></View>
                        <Text style={styles.textDescription}>
                            {profileStudent.bio}
                        </Text>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>Experiencia</Text>
                        <View style={styles.line}></View>
                        <Text style={styles.textDescription}>
                            {profileStudent.experience}
                        </Text>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>Educacion</Text>
                        <View style={styles.line}></View>
                        <Text style={styles.textDescription}>
                            {profileStudent.education}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
