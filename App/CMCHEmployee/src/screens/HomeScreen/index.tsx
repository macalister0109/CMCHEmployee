import { Text, View } from "react-native";
import Header from "../../components/Header";
import { styles } from "./styles";
import CardOffer from "../../components/CardOffer";
import Search from "../../components/Search";

export default function HomeScreen() {
    return (
        <View style={styles.screen}>
            <Header />
        </View>
    );
}
