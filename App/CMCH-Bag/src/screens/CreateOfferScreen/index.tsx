import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";
import Input from "../../components/Input";
import Label from "../../components/Label";
import { useNavigation } from "@react-navigation/native";
import { offerDates } from "../../types/offerDates";
import useStyles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import ProfileCompany from "../../data/profileCompany.json";

const ALLOWED_LABELS = [
    "Programacion",
    "Conectividad y Redes",
    "Construcciones Metalicas",
    "Gastronomia",
    "Administracion",
    "Electronica",
];

export default function CreateOfferScreen() {
    const navigation = useNavigation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState(ProfileCompany.name);
    const [location, setLocation] = useState("");
    const [vacant, setVacant] = useState("");
    const [img, setImg] = useState("");
    const [labelsText, setLabelsText] = useState("");

    // const handleCreate = () => {
    //     // Validaciones básicas
    //     if (!title.trim()) {
    //         Alert.alert("Error", "El título es obligatorio.");
    //         return;
    //     }
    //     // Parse labels: separadas por coma
    //     const labels = labelsText
    //         .split(",")
    //         .map((l) => l.trim())
    //         .filter((l) => l.length > 0);

    //     const invalid = labels.filter((l) => !ALLOWED_LABELS.includes(l));
    //     if (invalid.length > 0) {
    //         Alert.alert(
    //             "Error",
    //             `Las siguientes etiquetas no son válidas: ${invalid.join(", ")}`
    //         );
    //         return;
    //     }

    //     const offer: offerDates = {
    //         title: title.trim(),
    //         description: description.trim(),
    //         name: name.trim(),
    //         location: location.trim(),
    //         vacant: vacant.trim(),
    //         img: img.trim(),
    //         labels: labels as any,
    //     };

    //     // Guardar la oferta y volver a la pantalla anterior
    //     (async () => {
    //         try {
    //             await OffersService.addOffer(offer);
    //             Alert.alert("Éxito", "Oferta creada correctamente.", [
    //                 { text: "OK", onPress: () => (navigation as any).goBack() },
    //             ]);
    //         } catch (error) {
    //             console.error("Error guardando oferta:", error);
    //             Alert.alert("Error", "No se pudo guardar la oferta.");
    //         }
    //     })();
    // };
    const styles = useStyles();
    return (
        <ScrollView>
            <View style={styles.screen}>
                <View>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => (navigation as any).goBack()}
                            style={styles.backButton}>
                            <Ionicons
                                name="chevron-back-outline"
                                size={26}
                                color={"#007AFF"}></Ionicons>
                            <Text style={styles.backText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ display: "flex" }}>
                        <Text style={styles.label}>Título</Text>
                        <Input
                            onChangeTxt={setTitle}
                            keyboardType="ascii-capable"
                            secureText={false}
                            placeholder="Título de la oferta"
                        />

                        <Text style={styles.label}>Descripción</Text>
                        <Input
                            onChangeTxt={setDescription}
                            keyboardType="ascii-capable"
                            secureText={false}
                            placeholder="Descripción breve"
                        />

                        <Text style={styles.label}>Ubicación</Text>
                        <Input
                            onChangeTxt={setLocation}
                            keyboardType="ascii-capable"
                            secureText={false}
                            placeholder="Ciudad / Dirección"
                        />

                        <Text style={styles.label}>Vacantes</Text>
                        <Input
                            onChangeTxt={setVacant}
                            keyboardType="numeric"
                            secureText={false}
                            placeholder="Número de vacantes"
                        />

                        <Text style={styles.label}>Imagen (URL)</Text>
                        <Input
                            onChangeTxt={setImg}
                            keyboardType="ascii-capable"
                            secureText={false}
                            placeholder="URL de la imagen"
                        />

                        <Text style={styles.label}>
                            Etiquetas (separadas por coma)
                        </Text>
                        <Input
                            onChangeTxt={setLabelsText}
                            keyboardType="ascii-capable"
                            secureText={false}
                            placeholder={`Ej: Programacion, Gastronomia`}
                        />

                        <View style={styles.button}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.createButton}>
                                <Text style={styles.createText}>
                                    Publicar Oferta
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
