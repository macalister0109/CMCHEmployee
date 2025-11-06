import { View } from "react-native";
import JobOfferCard from "../../../components/JobOfferCard";
import { offerDates } from "../../../types/offerDates";
import Header from "../../../components/Header";
export default function JobScreen() {
    const offers: offerDates[] = [
        {
            title: "Técnico en Redes",
            description:
                "Instalación y configuración de redes LAN/WiFi para clientes empresariales.",
            name: "Redes Globales Ltda.",
            location: "Valparaíso, Chile",
            vacant: "3",
            puntations: "4.5",
            img: "https://example.com/network-job.jpg",
            labels: ["Conectividad y Redes", "Programacion", "Electronica"],
        },
        {
            title: "Ayudante de Cocina",
            description:
                "Asistir al chef en la preparación de platos y mantención del orden en cocina.",
            name: "Restaurante La Sazón",
            location: "Concepción, Chile",
            vacant: "1",
            puntations: "4.9",
            img: "https://example.com/kitchen-job.jpg",
            labels: ["Gastronomia"],
        },
    ];
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <JobOfferCard dates={offers[0]} />
        </View>
    );
}
