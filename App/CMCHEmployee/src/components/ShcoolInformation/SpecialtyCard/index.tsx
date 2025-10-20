import { specialtyDate, IMAGES } from "../../../types/specialtyDate";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import * as Clipboard from "expo-clipboard";

interface Props {
    data: specialtyDate;
    imageProfile: any;
    imageLogo: any;
}

export default function SpecialtyCard({
    data,
    imageProfile,
    imageLogo,
}: Props) {
    const copiar = () => {
        Clipboard.setStringAsync(data.profesor_jefe.correo);
    };
    return (
        <View style={styles.card}>
            <View>
                <Image source={imageLogo} style={styles.imgLogo}></Image>
            </View>
            <View style={styles.info}>
                <View>
                    <Text style={styles.title}>{data.nombre}</Text>
                    <Text style={styles.description}>{data.descripcion}</Text>
                </View>
                <View style={styles.owner}>
                    <Image
                        source={imageProfile}
                        style={styles.imgProfile}></Image>
                    <View>
                        <Text style={styles.name}>
                            {data.profesor_jefe.nombre}
                        </Text>
                        <Text style={styles.ownerText}>
                            JEFE DE ESPECIALIDAD
                        </Text>
                        <TouchableOpacity onPress={copiar}>
                            <Text style={styles.emailText}>
                                {data.profesor_jefe.correo}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
