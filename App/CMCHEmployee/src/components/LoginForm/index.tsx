import { View, TextInput, Alert, TouchableOpacity, Text } from "react-native";
import { useState, useEffect } from "react";
import { styles } from "./styles";
import { THEME_ESTUDENT } from "../../constants";

interface LoginCredentials {
    rut: string;
    password: string;
}

export default function LoginForm() {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        rut: "",
        password: "",
    });
    const handleInputChange = (
        field: keyof LoginCredentials,
        value: string
    ) => {
        setCredentials((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleLogin = () => {
        if (!credentials.rut.includes("-") || credentials.password.length < 6) {
            Alert.alert(
                "Error de Validación",
                "Verifica tu correo o la contraseña (mín. 6 caracteres)."
            );
            return;
        }

        // B. Lógica de Negocio (Aquí iría la llamada a tu API, por ejemplo, usando 'fetch' o 'axios')
        console.log("Enviando datos de login:", credentials);

        Alert.alert(
            "Login Exitoso (Simulado)",
            `Bienvenido ${credentials.rut}. Datos enviados.`
        );

        // Opcional: Limpiar el formulario después del envío
        setCredentials({ rut: "", password: "" });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <View style={styles.inputs}>
                <Text style={styles.label}>Ingrese el RUT:</Text>
                <TextInput
                    style={styles.input}
                    value={credentials.rut}
                    onChangeText={(text) => handleInputChange("rut", text)}
                    placeholderTextColor={THEME_ESTUDENT.colors.text_2}
                    placeholder="Ingresa el RUT"></TextInput>
                <Text style={styles.label}>Ingrese el Password:</Text>
                <TextInput
                    style={styles.input}
                    value={credentials.password}
                    onChangeText={(text) => handleInputChange("password", text)}
                    placeholder="Ingresa la contraseña"
                    placeholderTextColor={THEME_ESTUDENT.colors.text_2}
                    secureTextEntry></TextInput>
            </View>
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.textButton}>Ingresa</Text>
            </TouchableOpacity>
        </View>
    );
}
