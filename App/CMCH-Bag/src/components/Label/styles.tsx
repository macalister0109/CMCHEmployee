import { StyleSheet } from "react-native";
import useAppTheme from "../../context/ThemeContext";

const useStyles = () => {
    const theme = useAppTheme();
    return StyleSheet.create({
        label: {
            fontSize: theme.font_sizes.body,
            color: theme.colors.primary_1,
            fontWeight: theme.font_weights.bold,
        },
        container: {
            width: theme.width["80%"] * theme.device_width,
            marginVertical: 4,
        },
    });
};

export default useStyles;
