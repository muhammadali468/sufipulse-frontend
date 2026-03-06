import axios from "axios";
import { WriterFormData } from "../components/writers/WriterCredentialsForm";
const API_URL = process.env.NEXT_PUBLIC_API_URL
axios.defaults.withCredentials = true;

let accessToken: string | null = null;

if (typeof window !== "undefined") {
  accessToken = localStorage.getItem("accessToken") || null;
}
export const setAccessToken = (token: string) => {
    accessToken = token;
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config
});

api.interceptors.response.use((res) =>
    res,
    async (err) => {
        const originalRequest = err.config
        if (err.response?.status === 401 && !originalRequest._retry ) {
            originalRequest._retry = true;
            try {
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true })
                accessToken = response.data.accessToken
                if(accessToken){
                    localStorage.setItem("accessToken", accessToken);
                }

                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                return api(originalRequest)
            } catch (refreshErr) {
                console.error("Refresh token expired", refreshErr);
                localStorage.removeItem("accessToken");
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(err);
    }
)



export const register = (full_name: string, email: string, password: string) => {
    return api.post(`${API_URL}/auth/register`, { full_name, email, password })
}
export const login = (email: string, password: string) => {
    return api.post(`${API_URL}/auth/login`, { email, password })
}
export const googleLogin = () => {
    return api.get(`${API_URL}/auth/google`)
}
export const verifyEmail = (email: string, otp: string) => {
    return api.post(`${API_URL}/auth/verify-email`, { email, otp })
}
// Send OTP to email
export const resetPasswordSendOtp = (email: string) => {
    return api.post(`${API_URL}/auth/reset-password-send-otp`, { email })
}
// Verify OTP received on email
export const resetPasswordVerifyOtp = (email: string, otp: string) => {
    return api.post(`${API_URL}/auth/reset-password-verify-otp`, { email, otp })
}
// Reset password after verifying OTP on email
export const resetPasswordViaOtp = (email: string, password: string, tempToken: string) => {
    return api.post(`${API_URL}/auth/reset-password-via-otp`, { email, password, tempToken })
}
export const logout = () => {
    return api.post(`${API_URL}/auth/logout`)
}
// refresh token will be send in cookies as credentials is true
export const refreshToken = () => {
    return api.post(`${API_URL}/auth/refresh-token`)
}
export const createWriterProfile = (form:WriterFormData) => {
    return api.post(`${API_URL}/writer/create-profile`, form)
}
export const readWriterProfile = () => {
    return api.get(`${API_URL}/writer/read-profile`)
}
export const updateWriterProfile = (form:WriterFormData) => {
    return api.post(`${API_URL}/writer/update-profile`, form)
}
export const getAllWriter = () => {
    return api.get(`${API_URL}/writer/get-all`)
}