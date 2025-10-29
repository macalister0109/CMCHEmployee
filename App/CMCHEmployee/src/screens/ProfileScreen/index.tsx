import { Text, View } from "react-native";
import Header from "../../components/Header";
import { styles } from "./styles";
import ProfileInformation from "../../components/ProfileInformation";

export default function ProfileScreen() {
    return (
        <View style={styles.screen}>
            <Header />

            <ProfileInformation
                data={{
                    name: "Juan Ignacio Yañez",
                    subName: "PROGRAMACIÓN",
                    aboutMe:
                        "Soy Juan Ignacio Yañez. Estudiante de segundo año de la especialidad de Programación en un colegio Técnico Profesional. Estoy expandiendo mis habilidades al desarrollo móvil, explorando React Native y JavaScript para crear aplicaciones multiplataforma. También soy capaz de diseñar y modelar bases de datos SQL según los requerimientos de los usuarios. Mi experiencia con proyectos personales me ha permitido consolidar un nivel intermedio en estas tecnologías. Además de mis capacidades técnicas, me destaco por mi comunicación efectiva y mi habilidad para liderar equipos, aspectos que han sido clave para lograr resultados exitosos en mis proyectos académicos. Mi objetivo principal en este momento es seguir profundizando en los fundamentos de la programación y expandir mi set de herramientas, preparándome para los desafíos futuros y mi meta de ingresar a la carrera Licenciatura en Ingeniería en Ciencia de la Computación en la Universidad Católica de Chile.",
                }}
                img={[
                    require("../../../assets/img_contactos/daniela_ramirez2025.jpg"),
                    require("../../../assets/logos/img_3.jpg"),
                ]}
            />
        </View>
    );
}
