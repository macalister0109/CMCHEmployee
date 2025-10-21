import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../../constants";

export const styles = StyleSheet.create({
    card: { display: "flex", flexDirection: "row" },
    info: { width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["60%"] },
    title: {
        fontSize: THEME_ESTUDENT.font_sizes.h1,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
        color: THEME_ESTUDENT.colors.primary_3,
    },
    description: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
        color: THEME_ESTUDENT.colors.text,
        marginLeft: 8,
    },
    lineLeft: {
        borderLeftWidth: 2,
        borderLeftColor: THEME_ESTUDENT.colors.secondary_2,
    },
    descriptionContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
        marginLeft: 6,
    },
});
