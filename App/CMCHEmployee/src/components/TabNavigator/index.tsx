import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../../types/routes";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME_ESTUDENT } from "../../constants";

import HomeScreen from "../../screens/HomeScreen";
import JobScreen from "../../screens/JobScreen";
import ProfileScreen from "../../screens/ProfileScreen";

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
                    } else if (route.name === "JobTab") {
                        iconName = focused ? "briefcase" : "briefcase-outline";
                    } else if (route.name === "ProfileTab") {
                        iconName = focused ? "person" : "person-outline";
                    } else {
                        iconName = "help-circle-outline"; // Icono por defecto
                    }

                    return (
                        <Ionicons size={size} color={color} name={iconName} />
                    );
                },

                tabBarActiveTintColor: THEME_ESTUDENT.colors.primary_1,
                tabBarInactiveTintColor: THEME_ESTUDENT.colors.border,
                headerShown: false,
                tabBarLabelStyle: { fontWeight: "bold" },
                tabBarStyle: {
                    backgroundColor: THEME_ESTUDENT.colors.bg_1, // Fondo blanco
                    borderTopColor: "#EEEEEE",
                    height: 60,
                    paddingBottom: 12,
                },
                tabBarIconStyle: {},
            })}>
            {/* 3. Definición de las Pestañas (Screens) */}
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{ title: "Inicio" }} // Título que se muestra en la Tab Bar
            />
            <Tab.Screen
                name="JobTab"
                component={JobScreen}
                options={{ title: "Ofertas" }}
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
