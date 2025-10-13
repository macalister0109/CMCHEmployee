import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    search: {
        width: "90%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: 75,
        padding: 4,
        gap: 12,
        justifyContent: "space-evenly",
    },
    input: {
        width: "80%",
        height: "80%",
        backgroundColor: THEME_ESTUDENT.colors.text,
        borderRadius: 16,
        color: THEME_ESTUDENT.colors.primary_1,
        fontWeight: THEME_ESTUDENT.font_weights.bold,

        paddingHorizontal: 16, // --- SOMBRA iOS ---
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,

        // --- SOMBRA Android ---
        elevation: 6,
    },
    icon: {},
});
