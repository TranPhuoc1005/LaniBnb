import { LoginApi, signUpApi } from "@/services/auth.api";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import type { RegisterRequest } from "@/interface/auth.interface";

type LoginRequest = {
    email: string;
    password: string;
};

export const useLoginForm = (optional?: {}) => {
    const { setUser } = useAuthStore();

    return useMutation({
        mutationFn: (data: LoginRequest) => LoginApi(data),
        onSuccess: (responseData) => {
            setUser(responseData);
            console.log("✅ Đăng nhập thành công!");
        },
        onError: (error: any) => {
            console.error("❌ Đăng nhập thất bại:", error);
        },
        ...optional,
    });
};

export const useRegisterForm = () => {
    return useMutation({
        mutationFn: (data: RegisterRequest) => signUpApi(data),
        onSuccess: () => {
            console.log("✅ Đăng ký thành công!");
        },
        onError: (error: any) => {
            console.error("❌ Đăng ký thất bại:", error);
        },
    });
};