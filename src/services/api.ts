import axios, { type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage hoặc từ auth-storage
    const authStorage = localStorage.getItem("auth-storage");
    const authData = authStorage ? JSON.parse(authStorage) : null;
    const accessToken =
        localStorage.getItem("accessToken") ||
        authData?.state?.user?.token ||
        null;

    config.headers.set(
        "TokenCybersoft",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4"
    );

    if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
        config.headers.set("Token", `${accessToken}`);
    }

    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
