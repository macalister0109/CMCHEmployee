import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type Props = NativeStackScreenProps<any, any>;

export default function EditProfileScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Perfil</Text>
            <Button
                title="Guardar y volver"
                onPress={() => navigation.goBack()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 20, marginBottom: 12 },
});
