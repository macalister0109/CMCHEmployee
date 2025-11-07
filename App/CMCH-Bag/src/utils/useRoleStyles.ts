import { useMemo } from "react";
import { StyleSheet } from "react-native";
import useAppTheme from "../context/ThemeContext";

export default function useRoleStyles() {
    const theme = useAppTheme();

    return useMemo(() => {
        const base = {
            container: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.colors?.bg_1 ?? "#fff",
            },
            title: {
                fontSize: 20,
                marginBottom: 12,
                color: theme.colors?.primary_1 ?? "#000",
            },
        } as any;

        return StyleSheet.create(base);
    }, [theme]);
}
