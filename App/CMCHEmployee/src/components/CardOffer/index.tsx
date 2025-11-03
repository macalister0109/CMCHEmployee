import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { offerDates } from "../../types/offerDates";
import { THEME_ESTUDENT } from "../../constants";

interface Props {
    dates: offerDates;
}

export default function CardOffer({ dates }: Props) {
    const image = require("../../../assets/adaptive-icon.png");
    const getStatusColor = (state: offerDates["stateless"]) => {
        switch (state) {
            case "inProcess":
                return "#4CAF50"; // verde
            case "inMiddle":
                return "#FFD733"; // amarillo
            case "finalized":
                return "#FF3B30"; // rojo
            default:
                return "transparent";
        }
    };

    return (
        <View style={styles.card}>
            <Image source={image} style={styles.img} />
            <View
                style={[
                    styles.stateless,
                    { backgroundColor: getStatusColor(dates.stateless) },
                ]}
            />
            <View style={styles.info}>
                <View style={styles.headerCard}>
                    <Text style={styles.titleCard}>{dates.title}</Text>
                    <Text style={styles.name}>{dates.name}</Text>
                    <Text style={styles.description}>{dates.description}</Text>
                </View>
                <View>
                    <View style={styles.addInfo}>
                        <Ionicons
                            name="location-sharp"
                            size={16}
                            color={THEME_ESTUDENT.colors.third_1}></Ionicons>
                        <Text style={styles.textIcons}>{dates.location}</Text>
                    </View>
                    <View style={styles.addInfo}>
                        <Ionicons
                            name="people-sharp"
                            size={16}
                            color={THEME_ESTUDENT.colors.primary_2}></Ionicons>
                        <Text style={styles.textIcons}>{dates.vacant}</Text>
                    </View>
                    <View style={styles.addInfo}>
                        <Ionicons
                            name="star-sharp"
                            size={16}
                            color={"#FFD733"}></Ionicons>
                        <Text style={styles.textIcons}>{dates.puntations}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
