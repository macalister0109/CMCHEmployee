import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/TabNavigationStudent/HomeScreen";
import JobScreen from "../screens/TabNavigationStudent/JobScreen";
import ProfileScreen from "../screens/TabNavigationStudent/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";

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

export default function StudentTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }): BottomTabNavigationOptions => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName = "ellipse";
                    if (route.name === "Home") iconName = "home-outline";
                    if (route.name === "Jobs") iconName = "briefcase-outline";
                    if (route.name === "Profile")
                        iconName = "person-circle-outline";
                    return (
                        <Ionicons
                            name={iconName as any}
                            size={size}
                            color={color}
                        />
                    );
                },
            })}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Jobs" component={JobScreen} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}
