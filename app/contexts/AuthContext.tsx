"use client";
import { createContext, useState, useEffect, ReactNode, useContext } from "react"
import { jwtDecode } from "jwt-decode"
import * as api from "../api/auth"
import { useRouter } from "next/navigation";
// import { WriterFormData } from "../components/writers/WriterCredentialsForm";
import { Loader } from "lucide-react";

type User = { id: string, role: string, email: string, full_name: string, is_verified: boolean };
type AuthContextType = {
    user: User | null,
    accessToken: string | null,
    loading: boolean,
    profileStatus: string | null,
    login: (email: string, password: string) => Promise<void>,
    googleLogin: (credential?: string) => Promise<void>, // Fix: likely needs credential for Google
    logout: () => void,
    readWriterProfile: () => void;
};

interface DecodedToken {
    id: string;
    role: string;
    email: string;
    full_name: string;
    is_verified: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    accessToken: null,
    loading: false,
    profileStatus: null,
    login: async () => { },
    googleLogin: async () => { },
    logout: async () => { },
    readWriterProfile: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    // const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [isHydrated, setIsHydrated] = useState(false); // Add hydration flag
    // const [res, setRes] = useState() as any
    const [profileStatus, setProfileStatus] = useState<string>("")
    const router = useRouter();

    // Hydration fix: run init only after mount
    useEffect(() => {
        const init = async () => {
            // const storedAccess = localStorage.getItem("accessToken");
            const storedAccess = localStorage.getItem("accessToken");
            // const storedRefresh = localStorage.getItem("refreshToken");
            if (!storedAccess) {
                setIsHydrated(true);
                return;
            }  // nothing to do
            try {

                let token = storedAccess;
                if (!token) {
                    const res = await api.refreshToken();
                    token = res.data.accessToken;
                }
                if (token) {
                    setAccessToken(token);
                    const decoded: DecodedToken = jwtDecode(token);
                    setUser({ id: decoded.id, role: decoded.role, email: decoded.email, full_name: decoded.full_name, is_verified: decoded.is_verified });
                }
            } catch (err) {
                console.log("No valid session");
                setUser(null);
                setAccessToken(null);// Mark as hydrated

            } finally {
                setIsHydrated(true); // Mark as hydrated
            }
        };
        init();
    }, []);

    // const login = async (email: string, password: string) => {
    //     try {
    //         const res = await api.login(email, password);
    //         const { accessToken } = res.data;
    //         console.log("res.data", res.data)
    //         // Store tokens
    //         localStorage.setItem("accessToken", accessToken);
    //         setAccessToken(accessToken); // Standardize
    //         const decoded: DecodedToken = jwtDecode(accessToken);
    //         setUser({ id: decoded.id, role: decoded.role, email: decoded.email, full_name: decoded.full_name, is_verified: decoded.is_verified });
    //         // router.push('/dashboard'); // Add redirect
    //     } catch (error: any) {
    //         console.error("Login failed:", error);
    //         alert(error.response?.data?.message || "Login failed. Try again.");
    //     }
    // };

    const login = async (email: string, password: string) => {
        try {
            const res = await api.login(email, password);
            const { accessToken } = res.data;

            localStorage.setItem("accessToken", accessToken);
            setAccessToken(accessToken);

            const decoded: DecodedToken = jwtDecode(accessToken);

            setUser({
                id: decoded.id,
                role: decoded.role,
                email: decoded.email,
                full_name: decoded.full_name,
                is_verified: decoded.is_verified
            });

            return res.data;

        } catch (error: any) {
            console.error("Login failed:", error);

            // important: pass error back to caller
            throw error;
        }
    };

    const googleLogin = async () => { // Fix signature if using Google One Tap
        try {
            const res = await api.googleLogin();
            const token = res.data.accessToken;
            if (token) {
                setAccessToken(token);
                const decoded: DecodedToken = jwtDecode(token);
                setUser({ id: decoded.id, role: decoded.role, email: decoded.email, full_name: decoded.full_name, is_verified: decoded.is_verified });
            }
        } catch (error: any) {
            console.error("Login failed:", error);
            alert(error.response?.data?.message || "Login failed. Try again.");
        }
    };

    const logout = async () => {
        try {
            await api.logout()
        } catch (error) {
            console.error("Logout failed:", error);
        }
        finally {
            localStorage.removeItem("accessToken");
            setUser(null);
            router.push('/login');
        }
    };

    const readWriterProfile = async () => {
        try {
            const res = await api.readWriterProfile();
            setProfileStatus(res.data.profile_status)
            return res.data
        } catch (error) {
            console.log(error)
        }
    }
    // Prevent mismatch: show loading until hydrated
    if (!isHydrated) {
        return (
            <div className="bg-black/40 h-screen backdrop-blur-sm flex items-center justify-between">
                <Loader className="animate" />
            </div>
        );
    }

    // const isAdmin = user?.role === "admin";

    return (
        <AuthContext.Provider value={{
            user,
            accessToken,
            loading,
            login,
            googleLogin,
            logout,
            profileStatus,
            readWriterProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
