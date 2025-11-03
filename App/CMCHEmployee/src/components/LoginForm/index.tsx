import {
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    Text,
    ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { styles } from "./styles";
import { THEME_ESTUDENT } from "../../constants";
import apiService from "../../services/api";

interface LoginCredentials {
    rut: string;
    password: string;
}

interface Props {
    onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        rut: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (
        field: keyof LoginCredentials,
        value: string
    ) => {
        setCredentials((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleLogin = async () => {
        // Validación básica
        if (!credentials.rut || credentials.password.length <= 4) {
            Alert.alert(
                "Error de Validación",
                "Verifica tu RUT y contraseña (mín. 6 caracteres)."
            );
            return;
        }

        setLoading(true);

        try {
            console.log("🔐 Intentando login con:", credentials.rut);

            // Llamada al API del backend
            const response = await apiService.login(
                credentials.rut,
                credentials.password
            );

            console.log("📡 Respuesta del servidor:", response);

            if (response.success) {
                Alert.alert(
                    "✅ Login Exitoso",
                    `Bienvenido ${credentials.rut}!`,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setCredentials({ rut: "", password: "" });
                                onSuccess?.();
                            },
                        },
                    ]
                );
            } else {
                Alert.alert(
                    "❌ Error de Login",
                    response.error || "Credenciales incorrectas"
                );
            }
        } catch (error) {
            console.error("❌ Error en handleLogin:", error);
            Alert.alert(
                "Error de Conexión",
                "No se pudo conectar con el servidor. Verifica tu conexión."
            );
        } finally {
            setLoading(false);
        }
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
            <TouchableOpacity
                onPress={handleLogin}
                style={[styles.button, loading && { opacity: 0.6 }]}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator color={THEME_ESTUDENT.colors.text} />
                ) : (
                    <Text style={styles.textButton}>Ingresa</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
