import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import GradientBackground from "./src/components/GradientBackground/index";
import Input from "./src/components/Input/index";
export default function App() {
    return (
        <GradientBackground>
            <Input></Input>
        </GradientBackground>
    );
}
