import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "../components/TabNavigator";
import CreateOffer from "../screens/CreateOffer";

export type AppStackParamList = {
    Tabs: undefined;
    CreateOffer: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Tabs"
                component={TabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CreateOffer"
                component={CreateOffer}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
