import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    container: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["100%"],
        height: 95,
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-around",
        borderBottomWidth: 2,
        borderBottomColor: THEME_ESTUDENT.colors.third_2,
    },
    img_container: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["70%"],
        height: "80%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    img: {
        flex: 1,
        width: 230,
    },
});
