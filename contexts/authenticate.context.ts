import {create} from "zustand/react";
import {useCallback, useEffect} from "react";
import {useRouter} from "expo-router";

type AuthContextType = {
    isAuthenticated: boolean | null;
    login: () => void;
    logout: () => void;
}

export const useAuthenticate = create<AuthContextType>((set) => ({
    isAuthenticated: null,
    login: () => set({ isAuthenticated: true }),
    logout: () => set({ isAuthenticated: false }),
}));

export const useIsAuthenticated = () => {
    const isAuthenticated = useAuthenticate((state) => state.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/');
            return;
        }
        router.replace('/login');
        return;
    }, [isAuthenticated, router]);
}
export const useLogin = () => {
    const login = useAuthenticate((state) => state.login);
    const router = useRouter();

    return useCallback(() => {
        login();
        router.replace('/');
    }, [login, router])
}
export const useLogout = () => {
    const logout = useAuthenticate((state) => state.logout);
    const router = useRouter();

    return useCallback(() => {
        logout();
        router.replace('/login');
    }, [logout, router])
}