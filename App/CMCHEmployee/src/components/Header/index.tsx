import GradientBackground from "../GradientBackground";
import { Image, Text, View } from "react-native";
import { styles } from "./styles";

export default function Header() {
    return (
        <GradientBackground>
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
