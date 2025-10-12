import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import GradientBackground from "../../components/GradientBackground";
import { styles } from "./styles";
import RegisterFormStudent from "../../components/RegisterFormStudent";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
    const navigation: any = useNavigation();
    return (
        <GradientBackground>
            <View style={styles.container}>
                <RegisterFormStudent />

                <View style={{ display: "flex", gap: 12 }}>
                    <View style={styles.question}>
                        <Text style={styles.text}>¿Eres empresa?</Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("RegisterCompany")
                            }>
                            <Text style={styles.buttonText}>¡Registrala!</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate("Auth")}>
                        <Text style={styles.loginText}>Inicar Sesion</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GradientBackground>
    );
}
