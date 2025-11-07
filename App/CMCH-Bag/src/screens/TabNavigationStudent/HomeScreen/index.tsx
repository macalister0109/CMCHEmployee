import { View } from "react-native";
import Header from "../../../components/Header";
import ShcoolInformation from "../../../components/ShcoolInformation";

export default function HomeScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <ShcoolInformation />
        </View>
    );
}
