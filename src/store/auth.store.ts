import type { LoginRequest, RegisterRequest } from "@/interfaces/auth.interface";
import type { User } from "@/interfaces/users.interface";
import { persist } from "zustand/middleware";
import { create } from "zustand";
import { signInApi, signUpApi } from "@/services/auth.api";

type AuthStore = {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;

    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    
    signIn: (credentials: LoginRequest) => Promise<boolean>;
    signUp: (userData: RegisterRequest) => Promise<boolean>;
    signOut: () => void;

    reset: () => void;
}

export const userAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            signIn: async (credentials) => {
                set({ loading: true, error: null });
                try {
                    const res = await signInApi(credentials);

                    if (res.statusCode === 200) {
                        const token = res.content?.token || res.token || res.content?.accessToken;
                        const userData = res.content?.user || res.content;
                        
                        if (token) {
                            localStorage.setItem('accessToken', token);
                        }
                        
                        set({
                            user: userData,
                            isAuthenticated: true,
                            loading: false,
                            error: null
                        });
                        return true;
                    } else {
                        set({
                            error: res.message || "Đăng nhập thất bại",
                            loading: false
                        });
                        return false;
                    }
                } catch (error: any) {
                    const errorMessage = error?.response?.data?.message || 
                                       error?.response?.data?.content || 
                                       error?.message || 
                                       "Có lỗi xảy ra khi đăng nhập";
                    set({
                        error: errorMessage,
                        loading: false
                    });
                    return false;
                }
            },

            signUp: async (userData) => {
                set({ loading: true, error: null });
                try {
                    const res = await signUpApi(userData);
                    
                    if (res.statusCode === 200 || res.statusCode === 201) {
                        const userInfo = res.content?.user || res.content;
                        
                        const token = res.content?.token || res.token || res.content?.accessToken;
                        if (token) {
                            localStorage.setItem('accessToken', token);
                            set({
                                user: userInfo,
                                isAuthenticated: true,
                                loading: false,
                                error: null
                            });
                        } else {
                            set({ 
                                loading: false,
                                error: null 
                            });
                        }
                        return true;
                    } else {
                        set({
                            error: res.message || "Đăng ký thất bại",
                            loading: false
                        });
                        return false;
                    }
                } catch (error: any) {
                    const errorMessage = error?.response?.data?.message || 
                                       error?.response?.data?.content || 
                                       error?.message || 
                                       "Có lỗi xảy ra khi đăng ký";
                    set({
                        error: errorMessage,
                        loading: false
                    });
                    return false;
                }
            },

            signOut: () => {
                // Xóa token khỏi localStorage
                localStorage.removeItem('accessToken');
                
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null
                });
            },

            reset: () => {
                localStorage.removeItem('accessToken');
                set({
                    user: null,
                    loading: false,
                    error: null,
                    isAuthenticated: false
                });
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);