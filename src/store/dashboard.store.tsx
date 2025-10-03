import { create } from 'zustand'

type DashboardStore = {
    isMenu: Boolean,
    setIsMenu: () => void,
    setIsMenuSp: (isActive: boolean) => void,
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    isMenu: false,
    setIsMenu: () => set((state) => ({ isMenu: !state.isMenu })),
    setIsMenuSp: (isActive) => set({ isMenu: isActive }),
}))