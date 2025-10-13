import { Text, View } from "react-native";
import { styles } from "./styles";
import Header from "../../components/Header";
import { useState } from "react";
import { offerDates } from "../../types/offerDates";
import CardOffer from "../../components/CardOffer";
import Search from "../../components/Search";

export default function JobScreen() {
    const [date, setDate] = useState<offerDates>({
        title: "Desarrollador Junior",
        description:
            "Descripcion de la empresa Descripcion de la empresa Descripcion de la empresaDescripcion de la empresa",
        name: "Ejemplo nombre empresa",
        location: "Santiago, La Florida",
        vacant: "7",
        puntations: "2.3",
        img: "../../../assets/adaptive-icon.png",
    });
    return (
        <View style={styles.screen}>
            <Header />
            <Search />

            <CardOffer dates={date} />
        </View>
    );
}
