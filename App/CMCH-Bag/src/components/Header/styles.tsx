import { StyleSheet } from "react-native";
import useAppTheme from "../../context/ThemeContext";

const useStyles = () => {
    const theme = useAppTheme();
    return StyleSheet.create({
        container: {
            width: theme.device_width * theme.width["100%"],
            height: 95,
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "space-around",
            borderBottomWidth: 2,
            borderBottomColor: theme.colors.third_2,
        },
        img_container: {
            width: theme.device_width * theme.width["70%"],
            height: "70%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        img: {
            flex: 1,
            width: 230,
        },
    });
};

export default useStyles;
