import { LinearGradient } from "expo-linear-gradient";
import {} from "react-native";
import { THEME_ESTUDENT } from "./../../constants/index";
import { styles } from "./styles";
import { ReactNode } from "react";

type GradientBackgroundProps = {
    children: ReactNode;
    color: [string, string];
};

export default function GradientBackground({
    children,
    color,
}: GradientBackgroundProps) {
    return (
        <LinearGradient
            colors={[color[0], color[1]]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.linearGradient}>
            {children}
        </LinearGradient>
    );
}
