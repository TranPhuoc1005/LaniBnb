import type { User } from "./users.interface";

export interface LoginRequest {
    email: string;
    password: string;
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
    content: {
        user: User;
        token?: string;
    };
    dateTime?: string;
}