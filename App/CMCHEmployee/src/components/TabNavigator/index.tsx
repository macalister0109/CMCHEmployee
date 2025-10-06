import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../../constants/routes"; // Importamos el tipado
import { Text, View } from "react-native";
// Si no, debes instalar 'react-native-vector-icons'.
import { Ionicons } from "@expo/vector-icons";
import { THEME_ESTUDENT } from "../../constants";

// --- PANTALLAS SIMULADAS ---
// Reemplaza esto con tus componentes reales (Home, Profile, Settings)
const HomeScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Pantalla Principal</Text>
    </View>
);
const ProfileScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Pantalla de Perfil</Text>
    </View>
);
const SettingsScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Pantalla de Configuración</Text>
    </View>
);
// ----------------------------

// 1. Hook de creación con el tipado
const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            // 2. Opciones por defecto para todas las pestañas
            screenOptions={({ route }) => ({
                // Función para definir el ícono de la pestaña
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string;

                    if (route.name === "HomeTab") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "ProfileTab") {
                        iconName = focused ? "person" : "person-outline";
                    } else if (route.name === "JobTab") {
                        iconName = focused ? "briefcase" : "briefcase-outline";
                    } else {
                        iconName = "help-circle-outline"; // Icono por defecto
                    }

                    // Retorna el componente de icono
                    // (Asegúrate de tener instalada la librería de iconos)
                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },

                tabBarActiveTintColor: THEME_ESTUDENT.colors.primary_1, // Color del ícono y texto activo
                tabBarInactiveTintColor: THEME_ESTUDENT.colors.border, // Color inactivo
                headerShown: false, // Ocultar el encabezado de la pantalla
                tabBarLabelStyle: { fontWeight: "bold" },
                tabBarStyle: {
                    position: "absolute",
                    backgroundColor: THEME_ESTUDENT.colors.text, // Fondo blanco
                    borderTopColor: "#EEEEEE",
                    height: 60, // Aumenta la altura
                    paddingBottom: 5, // Un poco de padding abajo
                    marginHorizontal: 15, // Margen a los lados
                    marginBottom: 20,
                    borderRadius: 15,
                },
            })}>
            {/* 3. Definición de las Pestañas (Screens) */}
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{ title: "Inicio" }} // Título que se muestra en la Tab Bar
            />
            <Tab.Screen
                name="JobTab"
                component={SettingsScreen}
                options={{ title: "Ajustes" }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{ title: "Perfil" }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
