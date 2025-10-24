import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    container: {
        display: "flex",
    },
    who: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["90%"],
        display: "flex",
        gap: 8,
        padding: 4,
        alignItems: "center",
    },
    title: {
        fontSize: THEME_ESTUDENT.font_sizes.h1,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
        color: THEME_ESTUDENT.colors.primary_3,
    },
    description: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
        color: THEME_ESTUDENT.colors.text,
    },
    line: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["90%"],
        borderBottomWidth: 2,
        borderBottomColor: THEME_ESTUDENT.colors.secondary_2,
        marginVertical: 16,
    },
    descriptionContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
        marginLeft: 6,
    },
    img: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["90%"],
        height: 120,
        marginTop: 8,
        borderRadius: 4,
    },
    PEcontainer: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["90%"],
    },
    titleContainer: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["90%"],
    },
    footer: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["100%"],
        padding: 16,
    },
});
