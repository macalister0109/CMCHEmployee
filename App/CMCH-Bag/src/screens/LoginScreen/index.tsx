import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
    const { login } = useAuth();

    const enterAsStudent = () => {
        login("student");
        navigation.replace("StudentTabs");
    };

    const enterAsCompany = () => {
        login("company");
        navigation.replace("CompanyTabs");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Button title="Entrar como Student" onPress={enterAsStudent} />
            <View style={{ height: 12 }} />
            <Button title="Entrar como Company" onPress={enterAsCompany} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    title: { fontSize: 24, marginBottom: 16 },
});
