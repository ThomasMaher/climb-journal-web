import { createContext, useContext, useEffect, useState } from "react";
import { getUserStatus } from "../../api/user";
import type { UserState, UserData } from "../../models/user_models";

export const AuthContext = createContext<UserState>({user: undefined, setUser: ()=> {}, loading: true});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserData |undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUserStatus() {
            const response = await getUserStatus();
            if (response.ok && response.data) {
                setUser(response?.data);
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