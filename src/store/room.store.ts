import { create } from 'zustand';
import type { Room, RoomWithLocation } from '@/interfaces/room.interface';
import type { Location } from '@/interfaces/location.interface';
import { getRoomDetailApi, getRoomsApi } from '@/services/room.api';
import { useLocationStore } from './location.store';

type RoomStore = {
    rooms: Room[];
    roomsWithLocation: RoomWithLocation[];
    loading: boolean;
    error: string | null;

    setRooms: (rooms: Room[]) => void;
    setRoomsWithLocation: (rooms: RoomWithLocation[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;

    fetchRooms: () => Promise<void>;
    fetchRoomsWithLocation: () => Promise<void>;
    getRoomWithLocationById: (id: number) => RoomWithLocation | undefined;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
    rooms: [],
    roomsWithLocation: [],
    loading: false,
    error: null,

    setRooms: (rooms) => set({ rooms }),
    setRoomsWithLocation: (rooms) => set({ roomsWithLocation: rooms }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    fetchRooms: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getRoomsApi();
            set({ rooms: data, loading: false });
        } catch (error) {
            console.log(error);
            set({
                error: "Không thể tải danh sách phòng",
                loading: false
            });
        }
    },

    fetchRoomsWithLocation: async () => {
        set({ loading: true, error: null });
        try {
            // Lấy danh sách phòng
            const rooms = await getRoomsApi();
            
            // Lấy danh sách vị trí từ location store
            const locationStore = useLocationStore.getState();
            
            // Nếu chưa có locations, fetch trước
            if (locationStore.locations.length === 0) {
                await locationStore.fetchLocations();
            }

            // Kết hợp thông tin phòng với vị trí
            const roomsWithLocation: RoomWithLocation[] = rooms.map(room => {
                const location = locationStore.getLocationById(room.maViTri);
                return {
                    ...room,
                    viTri: location ? {
                        id: location.id,
                        tenViTri: location.tenViTri,
                        tinhThanh: location.tinhThanh,
                        quocGia: location.quocGia,
                        hinhAnh: location.hinhAnh
                    } : undefined
                };
            });

            set({ 
                rooms,
                roomsWithLocation,
                loading: false 
            });
        } catch (error) {
            console.log(error);
            set({
                error: "Không thể tải danh sách phòng với vị trí",
                loading: false
            });
        }
    },

    getRoomWithLocationById: (id: number) => {
        const { roomsWithLocation } = get();
        return roomsWithLocation.find(room => room.id === id);
    }
}));