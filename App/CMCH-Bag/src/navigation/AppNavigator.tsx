import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import StudentTabs from "./StudentTabs";
import CompanyTabs from "./CompanyTabs";

export type RootStackParamList = {
    Login: undefined;
    StudentTabs: undefined;
    CompanyTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="StudentTabs" component={StudentTabs} />
            <Stack.Screen name="CompanyTabs" component={CompanyTabs} />
        </Stack.Navigator>
    );
}
