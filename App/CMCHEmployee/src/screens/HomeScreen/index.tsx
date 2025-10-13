import { Text, View } from "react-native";
import Header from "../../components/Header";
import { styles } from "./styles";
import CardOffer from "../../components/CardOffer";
export default function HomeScreen() {
    return (
        <View style={styles.screen}>
            <Header />
            <CardOffer
                title={"Desarrollador Junior"}
                description="Descripcion de la empresa Descripcion de la empresa Descripcion de la empresaDescripcion de la empresa"></CardOffer>
        </View>
    );
}
