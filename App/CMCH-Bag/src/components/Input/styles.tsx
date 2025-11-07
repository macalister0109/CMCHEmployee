import { StyleSheet } from "react-native";
import useAppTheme from "../../context/ThemeContext";

const useStyles = () => {
    const theme = useAppTheme();
    return StyleSheet.create({
        input: {
            backgroundColor: theme.colors.bg_1,
            color: theme.colors.primary_2,
            width: theme.width["80%"] * theme.device_width,
            fontWeight: theme.font_weights.bold,
            borderRadius: 5,
            padding: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,

            // --- SOMBRA Android ---
            elevation: 8,
        },
    });
};

export default useStyles;
