import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    card: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["90%"],
        height: THEME_ESTUDENT.device_height * 0.168,
        backgroundColor: THEME_ESTUDENT.colors.text,
        display: "flex",
        flexDirection: "row",
        alignSelf: "center",
        borderRadius: 16,
        // --- SOMBRA iOS ---
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginVertical: 8,

        // --- SOMBRA Android ---
        elevation: 8,
    },
    info: {
        width: "70%",
        display: "flex",
        gap: 4,
        padding: 4,
    },
    image: { height: "100%", width: "30%", borderRadius: 16 },
    addInfo: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    name: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        color: THEME_ESTUDENT.colors.primary_3,
        fontWeight: THEME_ESTUDENT.font_weights.extraBold,
    },

    description: {
        fontSize: THEME_ESTUDENT.font_sizes.caption,
        color: THEME_ESTUDENT.colors.primary_1,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
    },
    owner: {
        display: "flex",
        marginLeft: 8,
    },
    nameT: {
        fontSize: THEME_ESTUDENT.font_sizes.caption,
        color: THEME_ESTUDENT.colors.primary_2,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
    },
    email: {
        fontSize: THEME_ESTUDENT.font_sizes.caption,
        color: THEME_ESTUDENT.colors.text_2,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
    },
    emailExternal: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
});
