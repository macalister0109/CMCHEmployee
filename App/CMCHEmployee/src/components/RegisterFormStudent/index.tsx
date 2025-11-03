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

interface RegisterCredentials {
    rut: string;
    password: string;
    name: string;
    lastName: string;
}

export default function RegisterFormStudent() {
    const [credentials, setCredentials] = useState<RegisterCredentials>({
        rut: "",
        password: "",
        name: "",
        lastName: "",
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (
        field: keyof RegisterCredentials,
        value: string
    ) => {
        setCredentials((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleRegister = async () => {
        // Validación básica
        if (!credentials.rut || credentials.password.length < 4) {
            Alert.alert(
                "Error de Validación",
                "Verifica tu RUT y contraseña (mín. 8 caracteres)."
            );
            return;
        }

        if (credentials.name.length < 2 || credentials.lastName.length < 2) {
            Alert.alert(
                "Error de Validación",
                "El nombre y apellido deben tener al menos 2 caracteres."
            );
            return;
        }

        setLoading(true);

        try {
            console.log(
                "📝 Registrando estudiante:",
                credentials.name,
                credentials.lastName
            );

            // Llamada al API del backend
            const response = await apiService.registerStudent({
                rut: credentials.rut,
                nombre: credentials.name,
                apellido: credentials.lastName,
                password: credentials.password,
            });

            console.log("📡 Respuesta del servidor:", response);

            if (response.success) {
                Alert.alert(
                    "✅ Registro Exitoso",
                    response.message ||
                        `Bienvenido ${credentials.name}! Tu cuenta ha sido creada.`,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setCredentials({
                                    rut: "",
                                    password: "",
                                    name: "",
                                    lastName: "",
                                });
                            },
                        },
                    ]
                );
            } else {
                Alert.alert(
                    "❌ Error de Registro",
                    response.error || "No se pudo completar el registro"
                );
            }
        } catch (error) {
            console.error("❌ Error en handleRegister:", error);
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
            <View style={styles.headers}>
                <Text style={styles.title}>Registrate</Text>
                <Text style={styles.subTitle}>Estudiante</Text>
            </View>
            <View style={styles.inputs}>
                <Text style={styles.label}>Ingrese el RUT:</Text>
                <TextInput
                    style={styles.input}
                    value={credentials.rut}
                    onChangeText={(text) => handleInputChange("rut", text)}
                    placeholderTextColor={THEME_ESTUDENT.colors.text_2}
                    placeholder="Ingresa el RUT"></TextInput>
                <Text style={styles.label}>Ingrese la contraseña:</Text>
                <TextInput
                    style={styles.input}
                    value={credentials.password}
                    onChangeText={(text) => handleInputChange("password", text)}
                    placeholder="Ingresa la contraseña"
                    placeholderTextColor={THEME_ESTUDENT.colors.text_2}
                    secureTextEntry></TextInput>
                <Text style={styles.label}>Ingresa tu nombre:</Text>

                <TextInput
                    style={styles.input}
                    value={credentials.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    placeholder="Ingresa tu nombre"
                    placeholderTextColor={
                        THEME_ESTUDENT.colors.text_2
                    }></TextInput>
                <Text style={styles.label}>Ingresa tu apellido:</Text>
                <TextInput
                    style={styles.input}
                    value={credentials.lastName}
                    onChangeText={(text) => handleInputChange("lastName", text)}
                    placeholder="Ingresa tu apellido"
                    placeholderTextColor={
                        THEME_ESTUDENT.colors.text_2
                    }></TextInput>
            </View>
            <TouchableOpacity
                onPress={handleRegister}
                style={[styles.button, loading && { opacity: 0.6 }]}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator color={THEME_ESTUDENT.colors.text} />
                ) : (
                    <Text style={styles.textButton}>Registrar Estudiante</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
