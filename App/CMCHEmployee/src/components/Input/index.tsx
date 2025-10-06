// Componente en proceso de creaccion
// Falta styles

import { View, TextInput, useWindowDimensions } from "react-native";
import { styles } from "./styles";
import { useState } from "react";
import { THEME_ESTUDENT } from "../../constants";

interface Props {
    placeHolder: string;
    value: string;
    setValue: (text: string) => void;
}

export default function Input({ value, setValue, placeHolder }: Props) {
    const { width } = useWindowDimensions();
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                placeholder={"Ingresa tu " + placeHolder}
                placeholderTextColor={THEME_ESTUDENT.colors.dark}></TextInput>
        </View>
    );
}
