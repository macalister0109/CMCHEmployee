import { StyleSheet } from "react-native";
import { useMemo } from "react";
import useAppTheme from "../../context/ThemeContext";
import type { AppTheme } from "../../constants/Theme";

// Hook de estilos memoizados para ShcoolInformation
export const useStyles = () => {
    const theme = useAppTheme();

    return useMemo(
        () =>
            StyleSheet.create({
                container: {
                    // display flex por defecto
                },
                who: {
                    width:
                        (theme as AppTheme).device_width *
                        (theme as AppTheme).width["90%"],
                    gap: 8,
                    padding: 4,
                    alignItems: "center",
                },
                title: {
                    fontSize: (theme as AppTheme).font_sizes.h1,
                    fontWeight: (theme as AppTheme).font_weights.regular,
                    color: (theme as AppTheme).colors.primary_3,
                },
                description: {
                    fontSize: (theme as AppTheme).font_sizes.body,
                    fontWeight: (theme as AppTheme).font_weights.regular,
                    color: (theme as AppTheme).colors.text,
                },
                line: {
                    width:
                        (theme as AppTheme).device_width *
                        (theme as AppTheme).width["90%"],
                    borderBottomWidth: 2,
                    borderBottomColor: (theme as AppTheme).colors.secondary_2,
                    marginVertical: 16,
                },
                descriptionContainer: {
                    flexDirection: "row",
                    gap: 8,
                    marginLeft: 6,
                },
                img: {
                    width:
                        (theme as AppTheme).device_width *
                        (theme as AppTheme).width["90%"],
                    height: 120,
                    marginTop: 8,
                    borderRadius: 4,
                },
                PEcontainer: {
                    width:
                        (theme as AppTheme).device_width *
                        (theme as AppTheme).width["90%"],
                },
                titleContainer: {
                    width:
                        (theme as AppTheme).device_width *
                        (theme as AppTheme).width["90%"],
                },
                footer: {
                    width:
                        (theme as AppTheme).device_width *
                        (theme as AppTheme).width["100%"],
                    padding: 16,
                },
            }),
        [theme]
    );
};
