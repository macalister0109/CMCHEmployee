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
            borderRadius: 100,
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
        profileContainer: {
            width: theme.device_width * theme.width["100%"],
            display: "flex",
            alignItems: "center",
        },
        infoContainer: {
            width: "100%",
            marginTop: 70,
            paddingHorizontal: 25,
        },

        email: {
            fontSize: 14,
            color: theme.colors.text_2,
            marginBottom: 2,
        },

        location: {
            fontSize: 14,
            color: theme.colors.text_2,
            marginBottom: 2,
        },

        name: {
            fontSize: theme.font_sizes.h2,
            fontWeight: theme.font_weights.bold,
            color: theme.colors.text,
        },

        career: {
            fontSize: 16,
            fontWeight: "bold",
            color: theme.colors.third_3,
            marginTop: 4,
        },
        descriptionContainer: {
            width: theme.device_width * theme.width["90%"],
        },
        line: {
            width: "100%",
            height: 1,
            borderBottomWidth: 3,
            borderBottomColor: theme.colors.primary_2,
        },
        title: {
            marginTop: 16,
            fontSize: theme.font_sizes.h2,
            fontWeight: theme.font_weights.bold,
            color: theme.colors.third_2,
            marginBottom: 4,
        },
        textDescription: {
            fontSize: theme.font_sizes.body,
            fontWeight: theme.font_weights.bold,
            color: theme.colors.text,
            marginTop: 8,
            marginBottom: 4,
        },
    });
};

export default useStyles;
