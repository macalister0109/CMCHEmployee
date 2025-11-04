import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "student" | "company" | null;

type AuthContextType = {
    role: UserRole;
    login: (role: Exclude<UserRole, null>) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>(null);

    const login = (r: Exclude<UserRole, null>) => setRole(r);
    const logout = () => setRole(null);

    return (
        <AuthContext.Provider value={{ role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
