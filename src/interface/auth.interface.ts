import type { ListUser } from "./user.interface";

export interface AuthApiResponse<T> {
    user: T;
    token: string;
}

export interface CurrentUser {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    avatar: string;
    gender: boolean;
    role: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone?: string;
    birthday?: string;
    gender?: boolean;
    role?: "USER" | "ADMIN";
}

export interface AuthResponse {
    statusCode: number;
    message: string;
    token?: string;
    content: {
        user: ListUser;
        accessToken?: string;
        token?: string;
    };
    dateTime?: string;
}