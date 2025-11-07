import { StyleSheet } from "react-native";
import useAppTheme from "../../context/ThemeContext";

const useStyles = () => {
    const theme = useAppTheme();
    return StyleSheet.create({
        search: {
            width: "90%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: 75,
            padding: 4,
            gap: 12,
            justifyContent: "space-evenly",
        },
        input: {
            width: "60%",
            height: "80%",
            backgroundColor: theme.colors.bg_1,
            borderRadius: 16,
            color: theme.colors.primary_1,
            fontWeight: theme.font_weights.bold,

            paddingHorizontal: 16, // --- SOMBRA iOS ---
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,

            // --- SOMBRA Android ---
            elevation: 6,
        },
        icon: {
            backgroundColor: "#fff",
            padding: 12,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 100,
        },
    });
};

export default useStyles;
