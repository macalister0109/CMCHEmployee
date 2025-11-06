import GradientBackground from "../GradientBackground";
import { Image, Text, View } from "react-native";
import useStyles from "./styles";

export default function Header() {
    const styles = useStyles();
    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.img_container}>
                    <Image
                        source={require("../../../assets/extraImages/LogoCMCH-large.webp")}
                        style={styles.img}
                    />
                </View>
            </View>
        </GradientBackground>
    );
}
