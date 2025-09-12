import { LinearGradient } from "expo-linear-gradient";
import {} from "react-native";
import { THEME_ESTUDENT } from "./../../constants/index";
import { styles } from "./styles";
import { ReactNode } from "react";

type GradientBackgroundProps = {
    children: ReactNode;
};

export default function GradientBackground({
    children,
}: GradientBackgroundProps) {
    return (
        <LinearGradient
            colors={[THEME_ESTUDENT.colors.primary, "#4425C7"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.linearGradient}>
            {children}
        </LinearGradient>
    );
}
