import type { AuthResponse, LoginRequest, RegisterRequest } from "@/interfaces/auth.interface";
import api from "./api";

export const signInApi = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
        const res = await api.post("/auth/signin", credentials);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

export const signUpApi = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
        const validRole = userData.role && ["USER", "ADMIN"].includes(userData.role) 
            ? userData.role 
            : "USER";
        
        const requestData = {
            id: 0,
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phone: userData.phone || "",
            birthday: userData.birthday || "",
            gender: userData.gender !== undefined ? userData.gender : true,
            role: validRole
        };
        const res = await api.post("/auth/signup", requestData);
        return res.data;
    } catch (error: any) {
        console.error('Register error:', error);
        throw error;
    }
}