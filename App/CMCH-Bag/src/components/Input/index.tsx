import { View, TextInput } from "react-native";
import useStyles from "./styles";
import useAppTheme from "../../context/ThemeContext";
type KeyBType = "numeric" | "ascii-capable";

interface Props {
    onChangeTxt: (text: string) => void;
    placeholder: string;
    keyboardType: KeyBType;
    secureText: boolean;
}

export default function Input({
    onChangeTxt,
    placeholder,
    keyboardType,
    secureText,
}: Props) {
    const styles = useStyles();
    const theme = useAppTheme();
    return (
        <View>
            <TextInput
                onChangeText={onChangeTxt}
                placeholder={placeholder}
                keyboardType={keyboardType}
                secureTextEntry={secureText}
                style={styles.input}
                placeholderTextColor={theme.colors.text_2}
            />
        </View>
    );
}
