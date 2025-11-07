import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import useStyles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import GradientBackground from "../../components/GradientBackground";
import Header from "../../components/Header";
import Search from "../../components/Search";

export default function JobScreen() {
    const { role } = useAuth();
    const styles = useStyles();
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, alignItems: "center", gap: 12 }}>
            <Header />
            <Search />
            <View style={styles.container}>
                {role === "company" && (
                    <View style={styles.btnContainer}>
                        <TouchableOpacity
                            onPress={() =>
                                (navigation as any).navigate("CreateOffer")
                            }
                            style={styles.button}>
                            <Text style={styles.textButton}>Crear Oferta</Text>
                            <Ionicons name="add-outline" size={32}></Ionicons>
                        </TouchableOpacity>
                    </View>
                )}
                <Text style={styles.title}>
                    {role === "company"
                        ? "Mis Ofertas Publicadas"
                        : "Ofertas Disponibles"}
                </Text>
                <View style={styles.line}></View>
            </View>
        </View>
    );
}
