import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import GradientBackground from "../../components/GradientBackground";
import { styles } from "./styles";
import RegisterFormCompany from "../../components/RegisterFormCompany";
import { THEME_ESTUDENT } from "../../constants";
interface Props {
    navigation?: any;
}

export default function RegisterCompany({ navigation }: Props) {
    return (
        <GradientBackground
            color={[
                THEME_ESTUDENT.colors.third_1,
                THEME_ESTUDENT.colors.third_2,
            ]}>
            <View style={styles.container}>
                <RegisterFormCompany />

                <View style={{ display: "flex", gap: 12 }}>
                    <View style={styles.question}>
                        <Text style={styles.text}>¿Eres estudiante?</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonText}>¡Registrate!</Text>
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
