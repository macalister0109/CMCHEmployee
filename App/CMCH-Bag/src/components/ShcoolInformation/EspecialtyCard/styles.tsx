import { StyleSheet } from "react-native";
import { useMemo } from "react";
import useAppTheme from "../../../context/ThemeContext";
import type { AppTheme } from "../../../constants/Theme";

// Hook de estilos memoizados: se recalculan sólo cuando cambia el theme
export const useStyles = () => {
    // `useAppTheme()` devuelve el objeto theme directamente
    const theme = useAppTheme();

    return useMemo(
        () =>
            StyleSheet.create({
                card: {
                    width: theme.device_width * theme.width["90%"],
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    // --- SOMBRA iOS ---
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,

                    // --- SOMBRA Android ---
                    elevation: 8,
                },
                imgLogo: {
                    width: "100%",
                    height: 75,
                    borderTopRightRadius: 16,
                    borderTopLeftRadius: 16,
                },
                info: {
                    display: "flex",
                    margin: 8,
                },
                title: {
                    fontSize: theme.font_sizes.h2,
                    fontWeight: theme.font_weights.regular,
                    color: theme.colors.primary_2,
                },
                description: {
                    fontSize: theme.font_sizes.body,
                    fontWeight: theme.font_weights.bold,
                    marginLeft: 4,
                },
                owner: {
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,
                    margin: 4,
                    alignItems: "center",
                },
                imgProfile: {
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                },
                ownerText: {
                    color: theme.colors.secondary_2,
                    fontStyle: "italic",
                },
                name: {
                    fontSize: theme.font_sizes.body,
                    fontWeight: theme.font_weights.bold,
                    color: theme.colors.primary_1,
                },
                emailText: {
                    color: theme.colors.primary_1,
                    fontStyle: "italic",
                    textDecorationLine: "underline",
                },
            }),
        [theme]
    );
};
