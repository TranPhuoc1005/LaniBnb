import type { AuthApiResponse, CurrentUser } from '@/interface/auth.interface'
import { create } from 'zustand'

const userLocal = localStorage.getItem('user');
const userParse: AuthApiResponse<CurrentUser> | null = userLocal ? JSON.parse(userLocal) : null;

type AuthStore = {
    user: AuthApiResponse<CurrentUser> | null,
    setUser: (user: AuthApiResponse<CurrentUser>) => void,
    clearUser: () => void,
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: userParse,
    setUser: (user: AuthApiResponse<CurrentUser>) => {
        localStorage.setItem('user', JSON.stringify(user))
        set({ user })
    },
    clearUser: () => {
        localStorage.removeItem('user')
        set({ user: null })
    },
}))
