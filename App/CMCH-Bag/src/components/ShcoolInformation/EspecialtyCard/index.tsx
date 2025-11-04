import { View, Text, Image } from "react-native";
import { styles } from "./styles";

export default function infoCard({
    img,
    text,
    title,
}: {
    img: any;
    text: string;
    title: string;
}) {
    return (
        <View style={styles.card}>
            <View style={styles.imgContainer}>
                <Image source={img} style={styles.img}></Image>
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{text}</Text>
            </View>
        </View>
    );
}
