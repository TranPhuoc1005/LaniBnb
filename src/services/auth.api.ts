import type { BaseApiResponse } from "@/interface/base.interface"
import type { AuthApiResponse, AuthResponse, CurrentUser, RegisterRequest } from "@/interface/auth.interface"
import api from "./api"

type LoginResquest = {
    email: string,
    password: string,
}

export const LoginApi = async (data: LoginResquest) => {
    try {
        const response = await api.post<BaseApiResponse<AuthApiResponse<CurrentUser>>>(`auth/signin`, data);
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ LoginApi ~ error:", error)
        throw error
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