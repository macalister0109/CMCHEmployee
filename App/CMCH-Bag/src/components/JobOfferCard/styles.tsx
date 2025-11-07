import { StyleSheet } from "react-native";
import useAppTheme from "../../context/ThemeContext";

const useStyles = () => {
    const theme = useAppTheme();
    return StyleSheet.create({
        card: {
            width: theme.device_width * theme.width["90%"],
            height: theme.device_height * 0.22,
            backgroundColor: theme.colors.bg_1,
            display: "flex",
            flexDirection: "row",
            alignSelf: "center",
            borderRadius: 16,
            // --- SOMBRA iOS ---
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,

            // --- SOMBRA Android ---
            elevation: 8,
        },
        headerCard: {
            display: "flex",
            gap: 4,
        },
        info: {
            width: "70%",
            display: "flex",
            gap: 4,
            padding: 4,
        },
        img: { height: "100%", width: "30%", borderRadius: 16 },
        addInfo: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
        },
        titleCard: {
            fontSize: theme.font_sizes.h2,
            color: theme.colors.primary_2,
            fontWeight: theme.font_weights.extraBold,
        },
        name: {
            fontSize: theme.font_sizes.body,
            color: theme.colors.primary_1,
            fontWeight: theme.font_weights.regular,
        },
        description: {
            fontSize: theme.font_sizes.caption,
            color: theme.colors.primary_2,
            fontWeight: theme.font_weights.bold,
        },
        textIcons: {
            fontSize: theme.font_sizes.caption,
            color: theme.colors.secondary_3,
            fontWeight: theme.font_weights.regular,
        },
        stateless: {
            position: "absolute",
            width: 10,
            height: 10,
            backgroundColor: "red",
            borderRadius: 100,
            bottom: 10,
            left: 10,
        },
        label: {
            backgroundColor: theme.colors.third_3,
            padding: 4,
            display: "flex",
            borderRadius: 5,
        },
        textLabel: {
            color: theme.colors.ligth,
            fontSize: theme.font_sizes.caption,
            fontWeight: theme.font_weights.bold,
        },
        labels: { flexDirection: "row", gap: 4, flexWrap: "wrap" },
    });
};

export default useStyles;
