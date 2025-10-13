import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    card: {
        width: THEME_ESTUDENT.device_width * THEME_ESTUDENT.width["90%"],
        height: THEME_ESTUDENT.device_height * THEME_ESTUDENT.width["20%"],
        backgroundColor: "rgba(155, 155, 155, 1)",
        display: "flex",
        flexDirection: "row",
        alignSelf: "center",
    },
    headerCard: {
        display: "flex",
        gap: 4,
    },
    img: { height: "100%", width: "30%" },
    titleCard: {},
    name: {},
    description: {},
});
