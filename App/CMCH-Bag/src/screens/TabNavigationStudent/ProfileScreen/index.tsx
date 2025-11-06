import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useRoleStyles from "../../../utils/useRoleStyles";
import Header from "../../../components/Header";
export default function ProfileScreen() {
    const navigation = useNavigation();
    const styles = useRoleStyles();

    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.title}>Perfil (Student)</Text>
            <Button
                title="Editar perfil"
                onPress={() => (navigation as any).navigate("EditProfile")}
            />
        </View>
    );
}
