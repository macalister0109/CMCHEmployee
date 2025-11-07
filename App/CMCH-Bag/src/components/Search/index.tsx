import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, TextInput } from "react-native";
import useStyle from "./styles";
import useAppTheme from "../../context/ThemeContext";
export default function Search() {
    const styles = useStyle();
    const theme = useAppTheme();
    return (
        <View style={styles.search}>
            <TouchableOpacity style={styles.icon}>
                <Ionicons
                    name="options-outline"
                    size={24}
                    color={theme.colors.primary_1}></Ionicons>
            </TouchableOpacity>
            <TextInput placeholder="Buscar" style={styles.input}></TextInput>
            <TouchableOpacity style={styles.icon}>
                <Ionicons
                    name="search-outline"
                    size={24}
                    color={theme.colors.primary_1}></Ionicons>
            </TouchableOpacity>
        </View>
    );
}
