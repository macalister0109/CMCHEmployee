import GradientBackground from "../GradientBackground";
import { Image, Text, View } from "react-native";
import { styles } from "./styles";
import LogoCMCHLarge from "../../../assets/logos/LogoCMCH-large.webp";

export default function Header() {
    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.img_container}>
                    <Image source={LogoCMCHLarge} style={styles.img} />
                </View>
                <Text>=</Text>
            </View>
        </GradientBackground>
    );
}
