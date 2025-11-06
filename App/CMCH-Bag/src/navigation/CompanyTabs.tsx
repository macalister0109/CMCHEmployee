import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/TabNavigationCompany/HomeScreen";
import JobScreen from "../screens/Jobs";
import ProfileScreen from "../screens/TabNavigationCompany/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ title: "Editar Perfil" }}
            />
        </Stack.Navigator>
    );
}

export default function CompanyTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName = "ellipse";
                    if (route.name === "Home") iconName = "home-outline";
                    if (route.name === "Jobs") iconName = "briefcase-outline";
                    if (route.name === "Profile") iconName = "business-outline";
                    return (
                        <Ionicons
                            name={iconName as any}
                            size={size as number}
                            color={color as string}
                        />
                    );
                },
            })}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: "Inicio",
                }}
            />
            <Tab.Screen
                name="Jobs"
                component={JobScreen}
                options={{
                    title: "Ofertas",
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{
                    title: "Perfil",
                }}
            />
        </Tab.Navigator>
    );
}
