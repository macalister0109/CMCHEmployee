import { Text, View } from "react-native";
import Header from "../../components/Header";
import { styles } from "./styles";
import RegisterFormStudent from "../../components/RegisterFormStudent";

export default function HomeScreen() {
    return (
        <View style={styles.screen}>
            <Header />
        </View>
    );
}
