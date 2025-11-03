import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    addBtn: {
        backgroundColor: THEME_ESTUDENT.colors.bg_1,
        padding: 8,
        borderRadius: 100,
        position: "absolute",
        right: 20,
        bottom: 20,
        // --- SOMBRA iOS ---
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,

        // --- SOMBRA Android ---
        elevation: 8,
    },
});
