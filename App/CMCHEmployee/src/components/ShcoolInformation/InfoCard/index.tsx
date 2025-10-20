import { View, Text, Image } from "react-native";
import { styles } from "./styles";
import promotions from "../../../data/promotions.json";
import image_1 from "../../../../assets/logos/image_1.jpg";

export default function infoCard() {
    return (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.title}>Visión</Text>
                <View style={styles.descriptionContainer}>
                    <View style={styles.lineLeft}></View>
                    <Text style={styles.description}>
                        {promotions.institucion.descripcion}
                    </Text>
                </View>
                <Text style={styles.title}>Misón</Text>
                <View style={styles.descriptionContainer}>
                    <View style={styles.lineLeft}></View>
                    <Text style={styles.description}>
                        {promotions.institucion.descripcion}
                    </Text>
                </View>
            </View>
            <Image source={image_1}></Image>
        </View>
    );
}
