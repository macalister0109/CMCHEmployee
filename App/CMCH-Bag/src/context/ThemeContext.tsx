import { useMemo } from "react";
import { useAuth } from "./AuthContext";
import THEME_ESTUDENT, { THEME_COMPANY, AppTheme } from "../constants/Theme";

export function getThemeByRole(role: "student" | "company" | null): AppTheme {
    if (role === "company") return THEME_COMPANY;
    return THEME_ESTUDENT;
}

export function useAppTheme(): AppTheme {
    const { role } = useAuth();
    return useMemo(() => getThemeByRole(role), [role]);
}

export default useAppTheme;
