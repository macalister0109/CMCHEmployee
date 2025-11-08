import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./src/navigation/AuthStack";
import AppStack from "./src/navigation/AppStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { authService } from "./src/services/api";
import { User, Empresa, UserType } from "./src/types/auth";

interface AuthState {
    isLoading: boolean;
    isLoggedIn: boolean;
    userType: UserType | null;
    userData: User | Empresa | null;
}

export default function App() {
    const [authState, setAuthState] = useState<AuthState>({
        isLoading: true,
        isLoggedIn: false,
        userType: null,
        userData: null
    });

    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const [isLoggedIn, userType, userData] = await Promise.all([
                AsyncStorage.getItem("isLoggedIn"),
                AsyncStorage.getItem("userType"),
                AsyncStorage.getItem("userData")
            ]);

            setAuthState({
                isLoading: false,
                isLoggedIn: isLoggedIn === "true",
                userType: (userType as 'user' | 'empresa' | null),
                userData: userData ? JSON.parse(userData) : null
            });
        } catch (error) {
            console.error('Error checking auth state:', error);
            setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            setAuthState({
                isLoading: false,
                isLoggedIn: false,
                userType: null,
                userData: null
            });
        } catch (error) {
            Alert.alert('Error', 'No se pudo cerrar sesión correctamente');
        }
    };

    if (authState.isLoading) return null;

    return (
        <NavigationContainer>
            {authState.isLoggedIn ? (
                <AppStack 
                    userType={authState.userType} 
                    userData={authState.userData}
                    onLogout={handleLogout}
                />
            ) : (
                <AuthStack 
                    onLoginSuccess={(type: UserType, data: User | Empresa) => 
                        setAuthState({
                            isLoading: false,
                            isLoggedIn: true,
                            userType: type,
                            userData: data
                        })
                    } 
                />
            )}
        </NavigationContainer>
    );
}
