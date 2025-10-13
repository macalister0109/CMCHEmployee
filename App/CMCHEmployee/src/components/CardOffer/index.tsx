import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

interface Props {
    title: string;
    description: string;
}

export default function CardOffer({ title, description }: Props) {
    return (
        <View style={styles.card}>
            <Image
                source={require("../../../assets/adaptive-icon.png")}
                style={styles.img}
            />
            <View>
                <View style={styles.headerCard}>
                    <Text style={styles.titleCard}>{title}</Text>
                    <Text style={styles.name}></Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
                <View>
                    <View>
                        <Ionicons name="location-outline"></Ionicons>
                        <Text></Text>
                    </View>
                    <View>
                        <Ionicons name="people-outline"></Ionicons>
                        <Text></Text>
                    </View>
                    <View>
                        <Ionicons name="star-outline"></Ionicons>
                        <Text></Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
