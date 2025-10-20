import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    card: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["90%"],
        height: THEME_ESTUDENT.device_height * THEME_ESTUDENT.width["20%"],
        backgroundColor: THEME_ESTUDENT.colors.bg_1,
        display: "flex",
        flexDirection: "row",
        alignSelf: "center",
        borderRadius: 16,
        // --- SOMBRA iOS ---
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,

        // --- SOMBRA Android ---
        elevation: 8,
    },
    headerCard: {
        display: "flex",
        gap: 4,
    },
    info: {
        width: "70%",
        display: "flex",
        gap: 4,
        padding: 4,
    },
    img: { height: "100%", width: "30%", borderRadius: 16 },
    addInfo: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    titleCard: {
        fontSize: THEME_ESTUDENT.font_sizes.h2,
        color: THEME_ESTUDENT.colors.primary_2,
        fontWeight: THEME_ESTUDENT.font_weights.extraBold,
    },
    name: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        color: THEME_ESTUDENT.colors.primary_1,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
    },
    description: {
        fontSize: THEME_ESTUDENT.font_sizes.caption,
        color: THEME_ESTUDENT.colors.primary_2,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
    },
    textIcons: {
        fontSize: THEME_ESTUDENT.font_sizes.caption,
        color: THEME_ESTUDENT.colors.secondary_3,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
    },
    stateless: {
        position: "absolute",
        width: 10,
        height: 10,
        backgroundColor: "red",
        borderRadius: 100,
        bottom: 10,
        left: 10,
    },
});
