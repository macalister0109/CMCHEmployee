import { StyleSheet } from "react-native";
import useAppTheme from "../../context/ThemeContext";

const useStyles = () => {
    const theme = useAppTheme();
    return StyleSheet.create({
        screen: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
        },
        title: { fontSize: 24, marginBottom: 16 },
    });
};

export default useStyles;
