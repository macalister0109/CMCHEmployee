import { View, TextInput, Alert, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { styles } from "./styles";
import { THEME_ESTUDENT } from "../../constants";
import apiService from "../../services/api";

interface RegisterCredentials {
    rut: string;
    companyPassword: string;
    companyName: string;
    contactEmail: string;
}

export default function RegisterFormCompany() {
    const [credentials, setCredentials] = useState<RegisterCredentials>({
        rut: "",
        companyPassword: "",
        companyName: "",
        contactEmail: "",
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
        // Validaciones básicas
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!credentials.rut) {
            Alert.alert(
                "Error de Validación",
                "Ingresa el RUT de la empresa."
            );
            return;
        }

        if (credentials.companyPassword.length < 8) {
            Alert.alert(
                "Error de Validación",
                "La contraseña debe tener al menos 8 caracteres."
            );
            return;
        }

        if (
            credentials.companyName.trim().length < 2 ||
            credentials.companyName.trim().length > 100
        ) {
            Alert.alert(
                "Error de Validación",
                "El nombre de la empresa debe tener entre 2 y 100 caracteres."
            );
            return;
        }

        if (!emailRegex.test(credentials.contactEmail)) {
            Alert.alert(
                "Error de Validación",
                "Ingresa un correo de contacto válido."
            );
            return;
        }

        setLoading(true);

        try {
            console.log("🏢 Registrando empresa:", credentials.companyName);
            
            // Llamada al API del backend
            const response = await apiService.registerCompany({
                nombre_empresa: credentials.companyName,
                rut_empresa: credentials.rut,
                email: credentials.contactEmail,
                password: credentials.companyPassword,
            });

            console.log("📡 Respuesta del servidor:", response);

            if (response.success) {
                Alert.alert(
                    "✅ Registro Exitoso",
                    response.message || `Empresa ${credentials.companyName} registrada correctamente.`,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setCredentials({
                                    rut: "",
                                    companyPassword: "",
                                    companyName: "",
                                    contactEmail: "",
                                });
                            },
                        },
                    ]
                );
            } else {
                Alert.alert(
                    "❌ Error de Registro",
                    response.error || "No se pudo completar el registro de la empresa"
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
                <Text style={styles.subTitle}>Empresa</Text>
            </View>
            <View style={styles.inputs}>
                <Text style={styles.label}>Ingrese el RUT:</Text>
                <TextInput
                    style={styles.input}
                    value={credentials.rut}
                    onChangeText={(text) => handleInputChange("rut", text)}
                    placeholderTextColor={THEME_ESTUDENT.colors.text_2}
                    placeholder="Ingresa el RUT"></TextInput>
                <Text style={styles.label}>Contraseña de la empresa:</Text>
                <TextInput
                    style={styles.input}
                    value={credentials.companyPassword}
                    onChangeText={(text) =>
                        handleInputChange("companyPassword", text)
                    }
                    placeholder="Ingresa la contraseña de la empresa"
                    placeholderTextColor={THEME_ESTUDENT.colors.text_2}
                    secureTextEntry></TextInput>

                <Text style={styles.label}>Nombre de la empresa:</Text>
                <TextInput
                    style={styles.input}
                    value={credentials.companyName}
                    onChangeText={(text) =>
                        handleInputChange("companyName", text)
                    }
                    placeholder="Ingresa el nombre de la empresa"
                    placeholderTextColor={
                        THEME_ESTUDENT.colors.text_2
                    }></TextInput>

                <Text style={styles.label}>Correo de contacto:</Text>
                <TextInput
                    style={styles.input}
                    value={credentials.contactEmail}
                    onChangeText={(text) =>
                        handleInputChange("contactEmail", text)
                    }
                    placeholder="correo@empresa.com"
                    placeholderTextColor={THEME_ESTUDENT.colors.text_2}
                    keyboardType="email-address"
                    autoCapitalize="none"></TextInput>
            </View>
            <TouchableOpacity 
                onPress={handleRegister} 
                style={[styles.button, loading && { opacity: 0.6 }]}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={THEME_ESTUDENT.colors.text} />
                ) : (
                    <Text style={styles.textButton}>Registrar Empresa</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
