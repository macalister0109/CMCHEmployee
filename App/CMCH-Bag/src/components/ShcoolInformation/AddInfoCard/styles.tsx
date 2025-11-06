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
                    justifyContent: "space-around",
                    backgroundColor: (theme as AppTheme).colors.primary_3,
                    padding: 12,
                    borderRadius: 16,
                },
                title: {
                    fontSize: (theme as AppTheme).font_sizes.h1,
                    fontWeight: (theme as AppTheme).font_weights.regular,
                    color: (theme as AppTheme).colors.bg_1,
                },
                description: {
                    fontSize: (theme as AppTheme).font_sizes.body,
                    fontWeight: (theme as AppTheme).font_weights.regular,
                    color: (theme as AppTheme).colors.bg_1,
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
                },
            }),
        [theme]
    );
};
