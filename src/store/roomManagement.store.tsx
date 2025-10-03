import { create } from 'zustand'

type roomManagementStore = {
    isPopup: boolean,
    setIsPopup: () => void,

    idRoom: number,
    setIdRoom: (numId: number) => void,
}

export const roomManagementStore = create<roomManagementStore>((set) => ({
    isPopup: false,
    setIsPopup: () => set((state) => ({ isPopup: !state.isPopup })),

    idRoom: 0,
    setIdRoom: (numId) => set({ idRoom: numId }),
}))
