import { StyleSheet } from "react-native";
import useAppTheme from "../../../context/ThemeContext";

const useStyles = () => {
    const theme = useAppTheme();

    return StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: "#fff",
        },

        bannerContainer: {
            position: "relative",
            width: "100%",
            height: 150,
            backgroundColor: "#ccc",
        },

        imgBanner: {
            width: "100%",
            height: "100%",
        },

        imgLogo: {
            width: 130,
            height: 130,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: "#fff",
            position: "absolute",
            bottom: -60,
            left: 25,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 6,
        },

        infoContainer: {
            marginTop: 70, // espacio después de la imagen circular
            alignItems: "flex-start",
            paddingHorizontal: 25,
        },

        email: {
            fontSize: 14,
            color: "#555",
            marginBottom: 2,
        },

        location: {
            fontSize: 14,
            color: "#777",
            marginBottom: 10,
        },

        name: {
            fontSize: 18,
            fontWeight: "600",
            color: "#000",
        },

        career: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#3B3B98",
            marginTop: 4,
        },
    });
};

export default useStyles;
