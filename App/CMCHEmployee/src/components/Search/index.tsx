import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, TextInput } from "react-native";
import { styles } from "./styles";
import { THEME_ESTUDENT } from "../../constants";
export default function Search() {
    return (
        <View style={styles.search}>
            <TouchableOpacity style={styles.icon}>
                <Ionicons
                    name="options-outline"
                    size={24}
                    color={THEME_ESTUDENT.colors.primary_1}></Ionicons>
            </TouchableOpacity>
            <TextInput placeholder="Buscar" style={styles.input}></TextInput>
            <TouchableOpacity style={styles.icon}>
                <Ionicons
                    name="search-outline"
                    size={24}
                    color={THEME_ESTUDENT.colors.primary_1}></Ionicons>
            </TouchableOpacity>
        </View>
    );
}
