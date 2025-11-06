import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/Input";
import Label from "../../components/Label";
import useStyles from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const RUT_LENGTH = 8;

export default function LoginScreen({ navigation }: Props) {
    const { login } = useAuth();
    const [rut, setRut] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Normalizar RUT: quitar espacios y caracteres no numéricos
        const cleaned = rut
            .toString()
            .trim()
            .replace(/[^0-9]/g, "");

        // Validar longitud de RUT
        if (cleaned.length < RUT_LENGTH) {
            Alert.alert(
                "Error",
                `El RUT debe tener al menos ${RUT_LENGTH} dígitos.`
            );
            return;
        }

        // Obtener los dos primeros dígitos del RUT limpiado
        const prefix = cleaned.substring(0, 2);
        let role: "student" | "company" | null = null;
        if (["76", "77", "78"].includes(prefix)) {
            role = "company";
        } else {
            const prefixNum = parseInt(prefix, 10);
            if (prefixNum >= 1 && prefixNum <= 25) {
                role = "student";
            }
        }
        if (!role) {
            Alert.alert(
                "Error",
                "El RUT ingresado no corresponde a un estudiante ni a una empresa."
            );
            return;
        }
        login(role);
        navigation.replace(role === "student" ? "StudentTabs" : "CompanyTabs");
    };
    const styles = useStyles();
    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Login</Text>
            <Label text="RUT (sin puntos ni guion)" />
            <Input
                onChangeTxt={setRut}
                keyboardType="numeric"
                secureText={false}
                placeholder="RUT"
            />
            <Label text="Contraseña" />
            <Input
                onChangeTxt={setPassword}
                keyboardType="ascii-capable"
                secureText={true}
                placeholder="Contraseña"
            />
            <Button title="Ingresar" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({});
