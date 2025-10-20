import { View, Text, ScrollView } from "react-native";
import promotions from "./../../data/promotions.json";
import { THEME_ESTUDENT } from "../../constants";
import SpecialtyCard from "./SpecialtyCard";
import InfoCard from "./InfoCard";
const defaultLogo = require("../../../assets/adaptive-icon.png");

// Mapa estático por si hay archivos con diferentes extensiones.
import administracion from "../../../assets/especialidades/administracion/img_logo.jpg";
import electronica from "../../../assets/especialidades/electronica/img_logo.jpg";
import construcciones_metalicas from "../../../assets/especialidades/construcciones_metalicas/img_logo.jpg";
import gastronomia from "../../../assets/especialidades/gastronomia/img_logo.jpg";
import conectividad_redes from "../../../assets/especialidades/conectividad_redes/img_logo.jpg";
import programacion from "../../../assets/especialidades/programacion/img_logo.jpg";
import { styles } from "./styles";

export default function ShcoolInformation() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.who}>
                <InfoCard />
            </View>
            <View
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginVertical: 24,
                }}>
                <SpecialtyCard
                    data={promotions.especialidades[0]}
                    imageLogo={administracion}
                    imageProfile={null}></SpecialtyCard>
                <SpecialtyCard
                    data={promotions.especialidades[1]}
                    imageLogo={electronica}
                    imageProfile={null}></SpecialtyCard>
                <SpecialtyCard
                    data={promotions.especialidades[2]}
                    imageLogo={construcciones_metalicas}
                    imageProfile={null}></SpecialtyCard>
                <SpecialtyCard
                    data={promotions.especialidades[3]}
                    imageLogo={gastronomia}
                    imageProfile={null}></SpecialtyCard>
                <SpecialtyCard
                    data={promotions.especialidades[4]}
                    imageLogo={conectividad_redes}
                    imageProfile={null}></SpecialtyCard>
                <SpecialtyCard
                    data={promotions.especialidades[5]}
                    imageLogo={programacion}
                    imageProfile={null}></SpecialtyCard>
            </View>
        </ScrollView>
    );
}
