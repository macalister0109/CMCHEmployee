import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./src/components/TabNavigator";

export default function App() {
    return (
        <NavigationContainer>
            <TabNavigator />
        </NavigationContainer>
    );
}
