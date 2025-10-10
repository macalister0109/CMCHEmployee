import { View, TextInput, Alert, TouchableOpacity, Text } from "react-native";
import { useState, useEffect } from "react";
import { styles } from "./styles";
import { THEME_ESTUDENT } from "../../constants";

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
        if (
            !credentials.rut.includes("-") ||
            credentials.password.length < 6 ||
            (credentials.name.length < 4 && credentials.name.length > 25) ||
            (credentials.lastName.length > 4 &&
                credentials.lastName.length > 25)
        ) {
            Alert.alert(
                "Error de Validación",
                "Verifica tu rut o la contraseña (mín. 6 caracteres)."
            );
            return;
        }

        console.log("Enviando datos de login:", credentials);
        console.log(credentials);

        Alert.alert(
            "Registrado Exitosamente (Simulado)",
            `Bienvenido ${credentials.name}. Datos enviados.`
        );

        // Opcional: Limpiar el formulario después del envío
        setCredentials({ rut: "", password: "", name: "", lastName: "" });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrate</Text>
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
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.textButton}>Ingresa</Text>
            </TouchableOpacity>
        </View>
    );
}
