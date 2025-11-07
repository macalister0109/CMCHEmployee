import { View, Text } from "react-native";
import useStyles from "./styles";

interface Props {
    text: string;
}

export default function Label({ text }: Props) {
    const styles = useStyles();
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{text}</Text>
        </View>
    );
}
