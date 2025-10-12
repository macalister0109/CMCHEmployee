import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    screen: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    registerQuestion: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
    },
    textRegister: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        color: THEME_ESTUDENT.colors.text,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
    },
    textRegisterLink: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        color: THEME_ESTUDENT.colors.secondary_1,
        textDecorationLine: "underline",
        fontWeight: THEME_ESTUDENT.font_weights.bold,
    },
});
