import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import * as Clipboard from "expo-clipboard";

interface Porps {
    name: string;
    email: string;
    image: any;
    occupation: string;
}

export default function FooterHome({ name, email, image, occupation }: Porps) {
    const copiar = () => {
        Clipboard.setStringAsync(email);
    };
    return (
        <View style={styles.card}>
            <Image source={image} style={styles.img}></Image>
            <View>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.ownerText}>{occupation}</Text>
                <TouchableOpacity onPress={copiar}>
                    <Text style={styles.emailText}>{email}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
