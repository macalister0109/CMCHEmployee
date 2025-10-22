import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    container: {
        position: "relative",
        alignItems: "center",
        height: THEME_ESTUDENT.device_height * THEME_ESTUDENT.width["20%"],
    },
    imgBanner: {
        width: "100%",
        height: "60%",
    },
    imgProfile: {
        width: "100%",
        height: "100%",
        borderRadius: 100,
    },
    imgProfileContainer: {
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        top: "25%",
        width: 120,
        height: 120,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: "white",
    },
});
