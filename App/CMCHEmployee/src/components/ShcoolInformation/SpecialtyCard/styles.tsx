import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../../constants";

export const styles = StyleSheet.create({
    card: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["90%"],
        backgroundColor: "#fff",
        borderRadius: 16,
        // --- SOMBRA iOS ---
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,

        // --- SOMBRA Android ---
        elevation: 8,
    },
    imgLogo: {
        width: "100%",
        height: 75,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    info: {
        display: "flex",
        margin: 8,
    },
    title: {
        fontSize: THEME_ESTUDENT.font_sizes.h2,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
        color: THEME_ESTUDENT.colors.primary_2,
    },
    description: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
        marginLeft: 4,
    },
    owner: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
        margin: 4,
        alignItems: "center",
    },
    imgProfile: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    ownerText: {
        color: THEME_ESTUDENT.colors.secondary_2,
        fontStyle: "italic",
    },
    name: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
        color: THEME_ESTUDENT.colors.primary_1,
    },
    emailText: {
        color: THEME_ESTUDENT.colors.primary_1,
        fontStyle: "italic",
        textDecorationLine: "underline",
    },
});
