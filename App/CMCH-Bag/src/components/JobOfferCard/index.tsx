import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useStyles from "./styles";
import { offerDates } from "../../types/offerDates";
import useAppTheme from "../../context/ThemeContext";

interface Props {
    dates: offerDates;
}

export default function JobOfferCard({ dates }: Props) {
    const image = require("../../../assets/adaptive-icon.png");
    const styles = useStyles();
    const theme = useAppTheme();

    return (
        <View style={styles.card}>
            <Image source={image} style={styles.img} />

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
                            color={theme.colors.third_1}></Ionicons>
                        <Text style={styles.textIcons}>{dates.location}</Text>
                    </View>
                    <View style={styles.addInfo}>
                        <Ionicons
                            name="people-sharp"
                            size={16}
                            color={theme.colors.primary_2}></Ionicons>
                        <Text style={styles.textIcons}>{dates.vacant}</Text>
                    </View>
                </View>

                <View style={styles.labels}>
                    {dates.labels.map((label, index) => (
                        <View key={index} style={styles.label}>
                            <Text style={styles.textLabel}>{label}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
