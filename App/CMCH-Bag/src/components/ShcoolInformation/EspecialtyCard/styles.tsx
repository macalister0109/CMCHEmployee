import { StyleSheet } from "react-native";
import { useMemo } from "react";
import useAppTheme from "../../../context/ThemeContext";
import type { AppTheme } from "../../../constants/Theme";
export const useSyles = () => {
    const { theme } = useAppTheme();
    return useMemo(() => StyleSheet.create({card: {
        width: theme.device_width * THEME_ESTUDENT.width["90%"],
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: THEME_ESTUDENT.colors.primary_3,
        padding: 12,
        borderRadius: 16,
    },
    title: {
        fontSize: THEME_ESTUDENT.font_sizes.h1,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
        color: THEME_ESTUDENT.colors.bg_1,
    },
    description: {
        fontSize: THEME_ESTUDENT.font_sizes.body,
        fontWeight: THEME_ESTUDENT.font_weights.regular,
        color: THEME_ESTUDENT.colors.bg_1,
    },
    descriptionContainer: {
        gap: 8,
        marginLeft: 6,
        width: "60%",
    },
    imgContainer: {
        width: "40%",
    },
    img: {
        width: 120,
        height: 120,
        borderRadius: 100,
        alignSelf: "center",
    },})
};

