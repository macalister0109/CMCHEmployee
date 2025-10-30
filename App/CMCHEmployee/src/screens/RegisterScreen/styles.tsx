import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";
export const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    text: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        color: THEME_ESTUDENT.colors.bg_1,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
    },
    buttonText: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        color: THEME_ESTUDENT.colors.bg_1,
        textDecorationLine: "underline",
        fontWeight: THEME_ESTUDENT.font_weights.bold,
    },
    question: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
    },
    loginButton: {
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: THEME_ESTUDENT.colors.primary_3,
        borderRadius: 10,
    },
    loginText: {
        color: THEME_ESTUDENT.colors.bg_1,
        fontWeight: THEME_ESTUDENT.font_weights.extraBold,
    },
});

export default styles;
