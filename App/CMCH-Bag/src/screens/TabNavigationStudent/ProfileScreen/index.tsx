import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";
import useStyles from "./styles";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const styles = useStyles();

    return (
        <View style={styles.screen}>
            <Header />
            <Button
                title="Editar perfil"
                onPress={() => (navigation as any).navigate("EditProfile")}
            />
        </View>
    );
}
