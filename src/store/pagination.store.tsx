import { create } from 'zustand'

type paginationStore = {
    pagi: number,
    setPagi: (numPagi: number) => void,

    userPagi: number,
    setUserPagi: (numPagi: number) => void,

    locationPagi: number,
    setLocationPagi: (numPagi: number) => void,

    roomPagi: number,
    setRoomPagi: (numPagi: number) => void
}

export const usePaginationStore = create<paginationStore>((set) => ({
    pagi: 1,
    setPagi: (numPagi) => set({ pagi: numPagi }),

    userPagi: 1,
    setUserPagi: (numPagi) => set({ userPagi: numPagi }),

    locationPagi: 1,
    setLocationPagi: (numPagi) => set({ locationPagi: numPagi }),

    roomPagi: 1,
    setRoomPagi: (numPagi) => set({ roomPagi: numPagi }),
}))


