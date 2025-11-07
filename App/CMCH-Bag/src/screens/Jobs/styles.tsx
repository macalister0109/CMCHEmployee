import { StyleSheet } from "react-native";
import useAppTheme from "../../context/ThemeContext";

const useStyles = () => {
    const theme = useAppTheme();
    return StyleSheet.create({
        container: {
            width: theme.device_width * theme.width["90%"],
            gap: 24,
        },
        title: {
            fontSize: theme.font_sizes.h1,
            color: theme.colors.text,
            fontWeight: theme.font_weights.bold,
        },
        button: {
            width: "90%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            backgroundColor: theme.colors.ligth,
            borderRadius: 10,
            padding: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,

            // --- SOMBRA Android ---
            elevation: 8,
        },
        btnContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        textButton: {
            fontSize: theme.font_sizes.h2,
            color: theme.colors.text,
            fontWeight: theme.font_weights.bold,
        },
        line: {
            width: "100%",
            height: 1,
            borderBottomWidth: 3,
            borderBottomColor: theme.colors.primary_2,
        },
    });
};

export default useStyles;
