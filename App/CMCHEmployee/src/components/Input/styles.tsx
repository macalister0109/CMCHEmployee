// styles.tsx
import { StyleSheet } from "react-native";
import { THEME_ESTUDENT } from "../../constants";

export const styles = StyleSheet.create({
    container: {
        width: THEME_ESTUDENT.width["80%"] * THEME_ESTUDENT.device_width,
    },
    input: {
        backgroundColor: THEME_ESTUDENT.colors.bg_1,
        color: THEME_ESTUDENT.colors.primary_1,
        width: THEME_ESTUDENT.width["80%"] * THEME_ESTUDENT.device_width,
        fontWeight: THEME_ESTUDENT.font_weights.bold,
        borderRadius: 5,
    },
});
