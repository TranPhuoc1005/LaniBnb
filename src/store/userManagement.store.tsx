import { create } from 'zustand'

type userManagementStore = {
    isPopup: boolean,
    setIsPopup: () => void,
    idUser: number,
    setIdUser: (numId: number) => void,
}

export const useUserManagementStore = create<userManagementStore>((set) => ({
    isPopup: false,
    setIsPopup: () => set((state) => ({ isPopup: !state.isPopup })),

    idUser: 0,
    setIdUser: (numId) => set({ idUser: numId }),
}))
