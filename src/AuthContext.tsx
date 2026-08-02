import { createContext, useContext, useEffect, useState } from "react";
import { getUserStatus } from "./api/user";
import type { UserState } from "./models/user_models";

const AuthContext = createContext<UserState>({user: null, setUser: ()=> {}, loading: true});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUserStatus() {
            const response = await getUserStatus();
            if (response.ok && response.data) {
                setUser(response.data);
            }
            setLoading(false);
        }

        loadUserStatus();
    }, []);

    return (
        <AuthContext value={{ user, setUser, loading }}>
            {children}
        </AuthContext>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}