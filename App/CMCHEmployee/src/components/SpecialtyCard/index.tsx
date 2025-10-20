import { View, Text, Image, TouchableOpacity } from "react-native";
import { specialtyDate } from "./../../types/specialtyDate";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { THEME_ESTUDENT } from "../../constants";

interface Props {
    data: specialtyDate;
    img: string;
}

export default function SpecialtyCard({ data, img }: Props) {
    return (
        <View style={styles.card}>
            <Image source={img} style={styles.image}></Image>
            <View style={styles.info}>
                <Text style={styles.name}>{data.nombre}</Text>
                <Text style={styles.description}>{data.descripcion}</Text>
                <Text style={styles.description}>Jefe Especialidad: </Text>
                <View style={styles.owner}>
                    <Text style={styles.nameT}>
                        {data.profesor_jefe.nombre}
                    </Text>
                    <TouchableOpacity style={styles.emailExternal}>
                        <Text style={styles.email}>
                            {data.profesor_jefe.correo}
                        </Text>
                        <Ionicons
                            name="copy-sharp"
                            color={THEME_ESTUDENT.colors.text_2}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
