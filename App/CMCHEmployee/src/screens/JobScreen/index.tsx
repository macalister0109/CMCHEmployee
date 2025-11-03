import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { styles } from "./styles";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { offerDates } from "../../types/offerDates";
import CardOffer from "../../components/CardOffer";
import Search from "../../components/Search";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { OffersService } from "../../services/offers.service";

export default function JobScreen() {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const [offers, setOffers] = useState<offerDates[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadOffers() {
            try {
                setIsLoading(true);
                setError(null);
                const loadedOffers = await OffersService.loadOffers();
                setOffers(loadedOffers);
            } catch (err) {
                setError("Error al cargar las ofertas");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        if (isFocused) {
            const route = navigation
                .getState()
                .routes.find((r: any) => r.name === "Tabs");
            const newOffer = route?.params?.params?.newOffer;

            if (newOffer) {
                OffersService.addOffer(newOffer)
                    .then(() => loadOffers())
                    .catch((err) => {
                        console.error("Error al guardar la nueva oferta:", err);
                        setError("Error al guardar la nueva oferta");
                    });
                navigation.setParams({ newOffer: undefined });
            } else {
                loadOffers();
            }
        }
    }, [isFocused, navigation]);

    const handleClearAll = () => {
        Alert.alert(
            "Borrar todas las ofertas",
            "¿Estás seguro? Esta acción eliminará todas las ofertas locales.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Borrar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            await OffersService.clearOffers();
                            setOffers([]);
                        } catch (err) {
                            console.error("Error al borrar ofertas:", err);
                            setError("Error al borrar ofertas");
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={[styles.screen, { gap: 24, alignItems: "center" }]}>
            <Header />
            <Search />
            {isLoading ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <ActivityIndicator size="large" />
                </View>
            ) : error ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Text style={{ color: "red" }}>{error}</Text>
                </View>
            ) : (
                <ScrollView
                    style={{ width: "100%" }}
                    contentContainerStyle={{
                        gap: 16,
                        alignItems: "center",
                        paddingBottom: 100,
                    }}>
                    {offers.map((offer, index) => (
                        <CardOffer key={index} dates={offer} />
                    ))}
                    {offers.length === 0 && (
                        <Text style={{ textAlign: "center", marginTop: 20 }}>
                            No hay ofertas disponibles
                        </Text>
                    )}
                </ScrollView>
            )}
            <View style={[styles.addBtn, { flexDirection: "row", gap: 12 }]}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("CreateOffer")}
                    style={{ padding: 8 }}>
                    <Ionicons name="add-outline" size={32}></Ionicons>
                </TouchableOpacity>
            </View>
        </View>
    );
}
