import axios from "axios";
// import { WriterFormData } from "../components/writers/WriterCredentialsForm";
import { KalamUnderDraft } from "../user/writer/dashboard/page";
import { VocalistProfileType } from "../types/vocalist.types";
import { WriterFormData } from "../types/writer.types";
import { ProducerProfileType } from "../types/producer.types";
import { LiteraryProfileType } from "../types/literary.types";
import { StudioProfileType } from "../types/studio.types";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.withCredentials = true;

let accessToken: string | null = null;

const getToken = () => {
    if (!accessToken && typeof window !== "undefined") {
        accessToken = localStorage.getItem("accessToken") || null;
    }
    return accessToken;
};

export const setAccessToken = (token: string) => {
    accessToken = token;
    if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
    }
};

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = getToken();
    config.headers = config.headers || {};
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Sending token:", token);
    }
    return config;
});

api.interceptors.response.use((res) =>
    res,
    async (err) => {
        const originalRequest = err.config
        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true })
                accessToken = response.data.accessToken
                if (accessToken) {
                    localStorage.setItem("accessToken", accessToken);
                }

                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                return api(originalRequest)
            } catch (refreshErr) {
                console.error("Refresh token expired", refreshErr);
                localStorage.removeItem("accessToken");
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
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
export const updatePassword = (currentPassword: string, newPassword: string) => {
    return api.post(`${API_URL}/auth/update-password`, { currentPassword, newPassword });
}
// WRITER
export const createWriterProfile = (form: WriterFormData) => {
    return api.post(`${API_URL}/writer/create-profile`, form)
}
export const readWriterProfile = () => {
    return api.get(`${API_URL}/writer/read-profile`)
}
export const updateWriterProfile = (form: WriterFormData) => {
    return api.post(`${API_URL}/writer/update-profile`, form)
}
export const updateWriterStatus = (id: string, status: string) => {
    return api.patch(`${API_URL}/writer/update-status/${id}`, { status })
}
export const deleteWriterProfile = () => {
    return api.delete(`${API_URL}/writer/delete-profile`)
}
export const getAllWriter = () => {
    return api.get(`${API_URL}/writer/get-all`)
}
// KALAMS
export const createKalam = (kalam: KalamUnderDraft) => {
    return api.post(`${API_URL}/kalam/create`, kalam)
}
export const getUserAllKalams = () => {
    return api.get(`${API_URL}/kalam/get-all-user`)
}
export const getAllKalams = () => {
    return api.get(`${API_URL}/kalam/get-all`)
}
export const updateKalam = (id: string, data: any) => {
    return api.put(`${API_URL}/kalam/${id}`, data);
};
export const deleteKalam = (id: string) => {
    return api.delete(`${API_URL}/kalam/${id}`);
}
export const updateKalamStatus = (id: string, status: string, revision_notes: string | null) => {
    return api.patch(`${API_URL}/kalam/update-status/${id}`, { status, revision_notes });
}
// Vocalist
export const createVocalistProfile = (form: VocalistProfileType) => {
    return api.post(`${API_URL}/vocalist/create`, form)
}

export const readVocalistProfile = () => {
    return api.get(`${API_URL}/vocalist/read`)
}

export const updateVocalistProfile = (form: VocalistProfileType) => {
    return api.patch(`${API_URL}/vocalist/update`, form)
}
export const updateVocalistStatus = (id: string, status: string) => {
    return api.patch(`${API_URL}/vocalist/update-status/${id}`, { status })
}

export const deleteVocalistProfile = () => {
    return api.delete(`${API_URL}/vocalist/delete`)
}

export const getAllVocalists = () => {
    return api.get(`${API_URL}/vocalist/all`)
}

// Sadas
export const createSada = (sada: any) => {
    return api.post(`${API_URL}/sada/create`, sada)
}

export const getUserAllSadas = () => {
    return api.get(`${API_URL}/sada/get-all-user`)
}

export const getAllSadas = () => {
    return api.get(`${API_URL}/sada/get-all`)
}

export const updateSada = (id: string, data: any) => {
    return api.put(`${API_URL}/sada/${id}`, data)
}

export const deleteSada = (id: string) => {
    return api.delete(`${API_URL}/sada/${id}`)
}

export const updateSadaStatus = (id: string, data: any) => {
    return api.patch(`${API_URL}/sada/update-status/${id}`, data)
}

// Producer
export const createProducerProfile = (form: ProducerProfileType) => {
    return api.post(`${API_URL}/producer/create`, form)
}

export const readProducerProfile = () => {
    return api.get(`${API_URL}/producer/read`)
}

export const updateProducerProfile = (form: ProducerProfileType) => {
    return api.patch(`${API_URL}/producer/update`, form)
}

export const updateProducerStatus = (id: string, status: string) => {
    return api.patch(`${API_URL}/producer/update-status/${id}`, { status })
}

export const deleteProducerProfile = () => {
    return api.delete(`${API_URL}/producer/delete`)
}

export const getAllProducers = () => {
    return api.get(`${API_URL}/producer/all`)
}

// Literary Contributor
export const createLiteraryProfile = (form: LiteraryProfileType) => {
    return api.post(`${API_URL}/literary/create`, form)
}

export const readLiteraryProfile = () => {
    return api.get(`${API_URL}/literary/read`)
}

export const updateLiteraryProfile = (form: LiteraryProfileType) => {
    return api.patch(`${API_URL}/literary/update`, form)
}

export const deleteLiteraryProfile = () => {
    return api.delete(`${API_URL}/literary/delete`)
}

// Studio Partner
export const createStudioProfile = (form: StudioProfileType) => {
    return api.post(`${API_URL}/studio/create`, form)
}

export const readStudioProfile = () => {
    return api.get(`${API_URL}/studio/read`)
}

export const updateStudioProfile = (form: StudioProfileType) => {
    return api.patch(`${API_URL}/studio/update`, form)
}

export const deleteStudioProfile = () => {
    return api.delete(`${API_URL}/studio/delete`)
}