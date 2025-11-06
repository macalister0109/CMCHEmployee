import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";
import { ReactNode } from "react";
import useAppTheme from "../../context/ThemeContext";
type GradientBackgroundProps = {
    children: ReactNode;
};

export default function GradientBackground({
    children,
}: GradientBackgroundProps) {
    const theme = useAppTheme();

    return (
        <LinearGradient
            colors={[theme.colors.primary_1, theme.colors.primary_2]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.linearGradient}>
            {children}
        </LinearGradient>
    );
}
