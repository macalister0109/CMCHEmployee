import GradientBackground from "../GradientBackground";
import { Image, Text, View } from "react-native";
import { styles } from "./styles";
import { THEME_ESTUDENT } from "../../constants";

export default function Header() {
    return (
        <GradientBackground
            color={[
                THEME_ESTUDENT.colors.primary_1,
                THEME_ESTUDENT.colors.primary_3,
            ]}>
            <View style={styles.container}>
                <View style={styles.img_container}>
                    <Image
                        source={require("../../../assets/logos/LogoCMCH-large.webp")}
                        style={styles.img}
                    />
                </View>
            </View>
        </GradientBackground>
    );
}
