import { StyleSheet } from "react-native";
import useAppTheme from "../../context/ThemeContext";
import { text } from "ionicons/icons";

const useStyles = () => {
    const theme = useAppTheme();
    return StyleSheet.create({
        screen: {
            width: theme.device_width * theme.width["100%"],
            height: theme.device_height * 1.09,

            justifyContent: "center",
            alignItems: "center",
        },
        title: {
            fontSize: theme.font_sizes.h1,
            color: theme.colors.ligth,
            fontWeight: theme.font_weights.bold,
            marginBottom: 16,
        },
        buttonContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: 16,
        },
        button: {
            backgroundColor: theme.colors.third_2,
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 4,
            width: 100,
            borderRadius: 10,
        },
        textButton: {
            color: theme.colors.ligth,
            fontSize: theme.font_sizes.body,
            fontWeight: theme.font_weights.bold,
        },
    });
};

export default useStyles;
