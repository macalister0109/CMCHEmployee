import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./src/navigation/AuthStack";
import TabNavigator from "./src/components/TabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = async () => {
            const val = await AsyncStorage.getItem("isLoggedIn");
            setIsLoggedIn(val === "true");
            setIsLoading(false);
        };
        checkLogin();
    }, []);

    if (isLoading) return null;

    return (
        <NavigationContainer>
            {true ? (
                <TabNavigator />
            ) : (
                <AuthStack onLoginSuccess={() => setIsLoggedIn(true)} />
            )}
        </NavigationContainer>
    );
}
