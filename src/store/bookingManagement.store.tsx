import { create } from 'zustand'

type bookingManagementStoreProps = {
    isPopup: boolean,
    setIsPopup: () => void,

    idBookingRoom: number | undefined,
    setIdBookingRoom: (numId: number | undefined) => void,

    idBooking: number | undefined,
    setIdBooking: (numId: number | undefined) => void,
}

export const useBookingManagementStore = create<bookingManagementStoreProps>((set) => ({
    isPopup: false,
    setIsPopup: () => set((state) => ({ isPopup: !state.isPopup })),

    idBookingRoom: 0,
    setIdBookingRoom: (numId) => set({ idBookingRoom: numId }),

    idBooking: 0,
    setIdBooking: (numId) => set({ idBooking: numId }),
}))
