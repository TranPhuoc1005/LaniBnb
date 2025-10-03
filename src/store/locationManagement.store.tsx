import { create } from 'zustand'

type locationManagementStore = {
    isPopup: boolean,
    setIsPopup: () => void,

    idLocation: number,
    setIdLocation: (numId: number) => void,

    selectedProvinceCode: string | null,
    setSelectedProvinceCode: (code: string) => void,
}

export const locationManagementStore = create<locationManagementStore>((set) => ({
    isPopup: false,
    setIsPopup: () => set((state) => ({ isPopup: !state.isPopup })),

    idLocation: 0,
    setIdLocation: (numId) => set({ idLocation: numId }),

    selectedProvinceCode: null,
    setSelectedProvinceCode: (code) => set({ selectedProvinceCode: code }),
}))

