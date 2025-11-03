import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    container: {
        height: THEME_ESTUDENT.device_height * THEME_ESTUDENT.width["100%"],
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["90%"],
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    backBtn: {
        padding: 6,
        marginRight: 8,
    },
    title: {
        fontSize: THEME_ESTUDENT.font_sizes.h2,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
    },
    formContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        gap: 4,
    },
    body: {
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    placeholder: {
        color: "#666",
        fontSize: 16,
        textAlign: "center",
    },
    input: {
        backgroundColor: THEME_ESTUDENT.colors.bg_1,
        color: THEME_ESTUDENT.colors.primary_2,
        width: THEME_ESTUDENT.width["80%"] * THEME_ESTUDENT.device_width,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
        borderRadius: 5,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,

        // --- SOMBRA Android ---
        elevation: 4,
    },
    label: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        color: THEME_ESTUDENT.colors.text,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
    },
    button: {
        width: "100%",
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        color: THEME_ESTUDENT.colors.primary_3,
        borderRadius: 20,
    },
    textButton: {
        color: THEME_ESTUDENT.colors.bg_1,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
        fontSize: THEME_ESTUDENT.font_sizes.body,
    },
});
