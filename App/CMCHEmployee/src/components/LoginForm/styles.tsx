import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    container: {
        width: THEME_ESTUDENT.width["90%"] * THEME_ESTUDENT.device_width,
        display: "flex",
        gap: 16,
        alignItems: "center",
    },
    inputs: {
        display: "flex",
        gap: 8,
    },
    input: {
        backgroundColor: THEME_ESTUDENT.colors.text,
        color: THEME_ESTUDENT.colors.primary_2,
        width: THEME_ESTUDENT.width["80%"] * THEME_ESTUDENT.device_width,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
        borderRadius: 5,
    },
    button: {
        width: THEME_ESTUDENT.width["30%"] * THEME_ESTUDENT.device_width,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        borderColor: THEME_ESTUDENT.colors.secondary_1,
        borderWidth: 4,
        borderRadius: 10,
    },
    textButton: {
        color: THEME_ESTUDENT.colors.text,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
        fontSize: THEME_ESTUDENT.font_sizes.body,
    },
    title: {
        fontSize: THEME_ESTUDENT.font_sizes.h1,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
        color: THEME_ESTUDENT.colors.text,
    },
    label: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        color: THEME_ESTUDENT.colors.text,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
    },
});
