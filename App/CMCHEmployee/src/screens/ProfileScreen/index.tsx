import { Text, View } from "react-native";
import Header from "../../components/Header";
import { styles } from "./styles";
import PorfileImages from "../../components/ProfileImages";

export default function ProfileScreen() {
    return (
        <View style={styles.screen}>
            <Header />
            <PorfileImages
                image_profile={require("../../../assets/img_contactos/daniela_ramirez2025.jpg")}
                image_banner={require("../../../assets/logos/img_3.jpg")}
            />
        </View>
    );
}
