import { StyleSheet } from "react-native";
import { useMemo } from "react";
import useAppTheme from "../../../context/ThemeContext";
import type { AppTheme } from "../../../constants/Theme";

export const useStyles = () => {
    const theme = useAppTheme();

    return useMemo(
        () =>
            StyleSheet.create({
                card: {
                    width:
                        (theme as AppTheme).device_width *
                        (theme as AppTheme).width["90%"],
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                },

                title: {
                    fontSize: (theme as AppTheme).font_sizes.h2,
                    fontWeight: (theme as AppTheme).font_weights.regular,
                    color: (theme as AppTheme).colors.bg_1,
                },
                description: {
                    fontSize: (theme as AppTheme).font_sizes.body,
                    fontWeight: (theme as AppTheme).font_weights.bold,
                    marginLeft: 4,
                },

                img: {
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                },
                ownerText: {
                    color: (theme as AppTheme).colors.secondary_1,
                    fontStyle: "italic",
                },

                emailText: {
                    color: (theme as AppTheme).colors.bg_1,
                    fontStyle: "italic",
                    textDecorationLine: "underline",
                },
            }),
        [theme]
    );
};
