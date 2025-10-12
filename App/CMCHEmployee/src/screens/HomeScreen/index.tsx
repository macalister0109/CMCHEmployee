import { Text, View } from "react-native";
import Header from "../../components/Header";
import { styles } from "./styles";
import RegisterFormStudent from "../../components/RegisterFormStudent";
import RegisterFormCompany from "../../components/RegisterFormCompany";

export default function HomeScreen() {
    return (
        <View style={styles.screen}>
            <Header />
            <RegisterFormCompany></RegisterFormCompany>
        </View>
    );
}
