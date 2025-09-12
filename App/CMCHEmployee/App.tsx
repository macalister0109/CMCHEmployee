import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import GradientBackground from "./src/components/GradientBackground/index";

export default function App() {
    return (
        <GradientBackground>
            <Text>Hola!</Text>
        </GradientBackground>
    );
}
