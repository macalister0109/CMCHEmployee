import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../../constants";

export const styles = StyleSheet.create({
    card: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["90%"],
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        // --- SOMBRA iOS ---
    },

    title: {
        fontSize: THEME_ESTUDENT.font_sizes.h2,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
        color: THEME_ESTUDENT.colors.bg_1,
    },
    description: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
        marginLeft: 4,
    },

    img: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    ownerText: {
        color: THEME_ESTUDENT.colors.secondary_1,
        fontStyle: "italic",
    },

    emailText: {
        color: THEME_ESTUDENT.colors.bg_1,
        fontStyle: "italic",
        textDecorationLine: "underline",
    },
});
