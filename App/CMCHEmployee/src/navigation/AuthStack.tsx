import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../screens/AuthScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RegisterCompany from "../screens/RegisterCompany";

export type AuthStackParamList = {
    Auth: undefined;
    Register: undefined;
    RegisterCompany: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface Props {
    onLoginSuccess?: () => void;
}

export default function AuthStack({ onLoginSuccess }: Props) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth">
                {(props: any) => (
                    <AuthScreen {...props} onLoginSuccess={onLoginSuccess} />
                )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="RegisterCompany" component={RegisterCompany} />
        </Stack.Navigator>
    );
}
