import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../../context/AuthContext";
import useStyles from "./styles";

export default function JobScreen() {
    const { role } = useAuth();
    const styles = useStyles();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {role === "company"
                    ? "Mis Ofertas Publicadas"
                    : "Ofertas Disponibles"}
            </Text>
            {/* Aquí irá la lista de ofertas */}
        </View>
    );
}
