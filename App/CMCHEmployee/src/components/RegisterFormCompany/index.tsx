import { View, TextInput, Alert, TouchableOpacity, Text } from "react-native";
import { useState, useEffect } from "react";
import { styles } from "./styles";
import { THEME_ESTUDENT } from "../../constants";

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

    const handleInputChange = (
        field: keyof RegisterCredentials,
        value: string
    ) => {
        setCredentials((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleLogin = () => {
        // Validaciones básicas
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!credentials.rut.includes("-")) {
            Alert.alert(
                "Error de Validación",
                "Ingresa un RUT válido (ej: 12.345.678-9)."
            );
            return;
        }

        if (credentials.companyPassword.length < 6) {
            Alert.alert(
                "Error de Validación",
                "La contraseña debe tener al menos 6 caracteres."
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

        console.log("Enviando datos de registro empresa:", credentials);

        Alert.alert(
            "Registro Exitoso (Simulado)",
            `Empresa ${credentials.companyName} registrada correctamente.`
        );

        // Limpiar el formulario después del envío
        setCredentials({
            rut: "",
            companyPassword: "",
            companyName: "",
            contactEmail: "",
        });
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
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.textButton}>Registrar Empresa</Text>
            </TouchableOpacity>
        </View>
    );
}
