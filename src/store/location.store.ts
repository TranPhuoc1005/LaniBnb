import { create } from 'zustand';
import type { Location } from '@/interfaces/location.interface';
import { getLocationsApi, getLocationDetailApi } from '@/services/location.api';

type LocationStore = {
    locations: Location[];
    loading: boolean;
    error: string | null;

    setLocations: (locations: Location[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;

    fetchLocations: () => Promise<void>;
    getLocationById: (id: number) => Location | undefined;
    getLocationByIdFromApi: (id: number) => Promise<Location | null>;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
    locations: [],
    loading: false,
    error: null,

    setLocations: (locations) => set({ locations }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    fetchLocations: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getLocationsApi();
            set({ locations: data, loading: false });
        } catch (error) {
            console.log(error);
            set({
                error: "Không thể tải danh sách vị trí",
                loading: false
            });
        }
    },

    getLocationById: (id: number) => {
        const { locations } = get();
        return locations.find(location => location.id === id);
    },

    getLocationByIdFromApi: async (id: number) => {
        try {
            const location = await getLocationDetailApi(id);
            return location;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}));