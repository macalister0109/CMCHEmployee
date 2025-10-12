import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LoginForm from "../../components/LoginForm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GradientBackground from "../../components/GradientBackground";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";

interface Props {
    onLoginSuccess?: () => void;
}

export default function AuthScreen({ onLoginSuccess }: Props) {
    const navigation: any = useNavigation();
    const handleSuccess = async () => {
        // Marca como logueado (simulado)
        await AsyncStorage.setItem("isLoggedIn", "true");
        // Notificar a App que el login fue exitoso
        onLoginSuccess?.();
    };

    return (
        <GradientBackground>
            <View style={styles.screen}>
                <LoginForm></LoginForm>
                <View style={styles.registerQuestion}>
                    <Text style={styles.textRegister}>¿Eres Nuevo?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.textRegisterLink}>Registrate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GradientBackground>
    );
}
