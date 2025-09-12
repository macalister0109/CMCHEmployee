// Componente en proceso de creaccion
// Falta styles

import { View, TextInput, useWindowDimensions } from "react-native";
import { styles } from "./styles";
export default function Input() {
    const { width } = useWindowDimensions();
    return (
        <View style={styles(width).container}>
            <TextInput style={styles(width).input}></TextInput>
        </View>
    );
}
