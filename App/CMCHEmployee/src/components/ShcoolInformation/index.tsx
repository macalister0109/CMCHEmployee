import { View, Text, ScrollView } from "react-native";
import SpecialtyCard from "../SpecialtyCard";
import promotions from "./../../data/promotions.json";

export default function ShcoolInformation() {
    return (
        <ScrollView style={{ display: "flex", gap: 24, height: 300 }}>
            <SpecialtyCard
                data={promotions.especialidades[0]}
                img={require("./../../../assets/adaptive-icon.png")}
            />
            <SpecialtyCard
                data={promotions.especialidades[1]}
                img={require("./../../../assets/adaptive-icon.png")}
            />
            <SpecialtyCard
                data={promotions.especialidades[2]}
                img={require("./../../../assets/adaptive-icon.png")}
            />
            <SpecialtyCard
                data={promotions.especialidades[3]}
                img={require("./../../../assets/adaptive-icon.png")}
            />
            <SpecialtyCard
                data={promotions.especialidades[4]}
                img={require("./../../../assets/adaptive-icon.png")}
            />
            <SpecialtyCard
                data={promotions.especialidades[5]}
                img={require("./../../../assets/adaptive-icon.png")}
            />
        </ScrollView>
    );
}
