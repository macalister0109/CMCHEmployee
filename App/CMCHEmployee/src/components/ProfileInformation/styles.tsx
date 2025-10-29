import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    infoContainer: {
        width: "100%",
        alignItems: "center",
        gap: 16,
    },
    nameContainer: {
        width: "100%",
        display: "flex",
        alignItems: "center",
    },
    aboutMeContainer: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["90%"],
        display: "flex",
    },
    name: {
        fontSize: THEME_ESTUDENT.font_sizes.h2,
        color: THEME_ESTUDENT.colors.primary_1,
    },
    subName: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        color: THEME_ESTUDENT.colors.secondary_2,
        fontStyle: "italic",
    },
    title: {
        fontSize: THEME_ESTUDENT.font_sizes.h2,
        color: THEME_ESTUDENT.colors.primary_1,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
        marginLeft: 4,
    },
    line: {
        width: "100%",
        borderBlockColor: THEME_ESTUDENT.colors.secondary_1,
        borderBottomWidth: 2,
        marginVertical: 4,
    },
    description: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        color: THEME_ESTUDENT.colors.text,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
        marginLeft: 4,
        width: "100%",
    },
});
