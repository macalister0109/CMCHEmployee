// styles.tsx
import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = (width: number) =>
    StyleSheet.create({
        container: {
            width: THEME_ESTUDENT.width["90%"] * width,
        },
        input: {
            flex: 1,
            backgroundColor: THEME_ESTUDENT.colors.light,
            color: THEME_ESTUDENT.colors.primary,
        },
    });
