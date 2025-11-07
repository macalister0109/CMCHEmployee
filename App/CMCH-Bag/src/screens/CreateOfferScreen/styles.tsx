import { StyleSheet } from "react-native";
import useAppTheme from "../../context/ThemeContext";

const useStyles = () => {
    const theme = useAppTheme();
    return StyleSheet.create({
        screen: {
            width: theme.device_width * theme.width["100%"],
            height: theme.device_height * theme.width["100%"],
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
        },

        button: {
            marginTop: 16,
            width: "100%",
            display: "flex",
            alignItems: "center",
        },
        header: {
            width: "100%",
            alignItems: "flex-start",
            marginBottom: 8,
        },
        backButton: {
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        backText: {
            color: "#007AFF",
            fontSize: theme.font_sizes.h2,
            fontWeight: "bold",
        },
        createButton: {
            paddingVertical: 12,
            paddingHorizontal: 12,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.third_3,
            borderRadius: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,

            // --- SOMBRA Android ---
            elevation: 4,
        },
        createText: {
            color: theme.colors.ligth,
            fontSize: theme.font_sizes.h2,
        },
        label: {
            color: theme.colors.third_3,
            fontSize: theme.font_sizes.body,
            marginVertical: 4,
            fontWeight: theme.font_weights.bold,
        },
    });
};

export default useStyles;
