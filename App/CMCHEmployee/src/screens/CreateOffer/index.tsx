import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { OffersService } from "../../services/offers.service";
import { Ionicons } from "@expo/vector-icons";
import { offerDates } from "../../types/offerDates";
import { styles } from "./styles";
import { THEME_ESTUDENT } from "../../constants";
import GradientBackground from "../../components/GradientBackground";

const ESPECIALIDADES = [
    "programacion",
    "conectividad_redes",
    "electronica",
    "construcciones_metalicas",
    "gastronomia",
] as const;

type Especialidad = (typeof ESPECIALIDADES)[number];

export default function CreateOffer() {
    const navigation = useNavigation<any>();
    const [especialidad, setEspecialidad] =
        useState<Especialidad>("programacion");
    const [form, setForm] = useState<offerDates>({
        title: "",
        description: "",
        name: "",
        location: "",
        vacant: "",
        puntations: "",
        img: `assets/especialidades/programacion/img_logo.jpg`,
        stateless: "inProcess",
    });

    const handleChange = (key: keyof offerDates, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleEspecialidadChange = (esp: Especialidad) => {
        setEspecialidad(esp);
        setForm((prev) => ({
            ...prev,
            img: `./assets/especialidades/${esp}/img_logo.wevp`,
        }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!form.title || !form.name) {
            Alert.alert(
                "Validación",
                "El título y el nombre de la empresa son obligatorios."
            );
            return;
        }

        try {
            setIsSubmitting(true);
            await OffersService.addOffer(form);
            navigation.navigate("Tabs", {
                screen: "JobTab",
            });
        } catch (error) {
            Alert.alert(
                "Error",
                "Hubo un problema al guardar la oferta. Por favor, intenta de nuevo."
            );
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ width: "100%" }}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Crear nueva oferta</Text>
                </View>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                    style={styles.input}
                    value={form.title}
                    onChangeText={(t) => handleChange("title", t)}
                    placeholder="Desarrollador Fullstack"
                />

                <Text style={styles.label}>Descripción</Text>
                <TextInput
                    style={[
                        styles.input,
                        { height: 120, textAlignVertical: "top" },
                    ]}
                    value={form.description}
                    onChangeText={(t) => handleChange("description", t)}
                    placeholder="Descripción de la oferta"
                    multiline
                />

                <Text style={styles.label}>Empresa</Text>
                <TextInput
                    style={styles.input}
                    value={form.name}
                    onChangeText={(t) => handleChange("name", t)}
                    placeholder="Nombre de la empresa"
                />

                <Text style={styles.label}>Ubicación</Text>
                <TextInput
                    style={styles.input}
                    value={form.location}
                    onChangeText={(t) => handleChange("location", t)}
                    placeholder="Ciudad, Comuna"
                />

                <Text style={styles.label}>Vacantes</Text>
                <TextInput
                    style={styles.input}
                    value={form.vacant}
                    onChangeText={(t) => handleChange("vacant", t)}
                    placeholder="Número de vacantes"
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Puntuación</Text>
                <TextInput
                    style={styles.input}
                    value={form.puntations}
                    onChangeText={(t) => handleChange("puntations", t)}
                    placeholder="e.g. 4.5"
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Especialidad</Text>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 12,
                    }}>
                    {ESPECIALIDADES.map((esp) => (
                        <TouchableOpacity
                            key={esp}
                            onPress={() => handleEspecialidadChange(esp)}
                            style={{
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                borderRadius: 8,
                                borderWidth: especialidad === esp ? 2 : 1,
                                borderColor:
                                    especialidad === esp ? "#333" : "#CCC",
                                backgroundColor:
                                    especialidad === esp
                                        ? THEME_ESTUDENT.colors.primary_2
                                        : "transparent",
                            }}>
                            <Text
                                style={{
                                    color:
                                        especialidad === esp ? "#FFF" : "#333",
                                }}>
                                {esp.replace("_", " ")}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <GradientBackground
                    color={[
                        THEME_ESTUDENT.colors.primary_1,
                        THEME_ESTUDENT.colors.primary_2,
                    ]}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            isSubmitting && { opacity: 0.7 },
                        ]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}>
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.textButton}>Crear oferta</Text>
                        )}
                    </TouchableOpacity>
                </GradientBackground>
            </View>
        </View>
    );
}
