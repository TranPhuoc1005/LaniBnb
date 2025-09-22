import type { Booking, CreateBookingRequest,} from "@/interfaces/booking.interface";
import { createBookingApi, deleteBookingApi, getBookingsByUserApi } from "@/services/booking.api";
import { getRoomDetailApi } from "@/services/room.api";
import { create } from "zustand";

type BookingStore = {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
    isCreatingBooking: boolean;
    createBookingSuccess: boolean;
    lastFetchedUserId: number | null;
    lastFetchTime: number | null; // Thêm timestamp để track thời gian fetch
    cacheValidityMs: number; // Thời gian cache hợp lệ (mặc định 5 phút)

    setBookings: (booking: Booking[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setCreateBookingSuccess: (success: boolean) => void;
    clearError: () => void;
    clearBookings: () => void;
    invalidateCache: () => void;

    fetchUserBookings: (userId: number) => Promise<void>;
    fetchBookingsWithRoomDetails: (userId: number, forceRefresh?: boolean) => Promise<void>;

    createBooking: (bookingData: CreateBookingRequest) => Promise<boolean>;
    deleteBooking: (bookingId: number) => Promise<boolean>;
};

export const useBookingStore = create<BookingStore>((set, get) => ({
    bookings: [],
    loading: false,
    error: null,
    isCreatingBooking: false,
    createBookingSuccess: false,
    lastFetchedUserId: null,
    lastFetchTime: null,
    cacheValidityMs: 5 * 60 * 1000, // 5 phút

    setBookings: (bookings) => set({ bookings }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setCreateBookingSuccess: (success) =>
        set({ createBookingSuccess: success }),
    clearError: () => set({ error: null, createBookingSuccess: false }),
    clearBookings: () => set({ 
        bookings: [], 
        lastFetchedUserId: null, 
        lastFetchTime: null 
    }),
    invalidateCache: () => set({ 
        lastFetchTime: null,
        error: null 
    }),

    fetchUserBookings: async (userId: number) => {
        set({ loading: true, error: null });
        try {
            const data = await getBookingsByUserApi(userId);
            console.log("Fetched bookings:", data);
            set({
                bookings: data.map((booking) => ({
                    ...booking,
                    status: "confirmed" as const,
                })),
                loading: false,
                lastFetchedUserId: userId,
                lastFetchTime: Date.now(),
            });
        } catch (error) {
            console.error(error);
            set({
                error: "Không thể tải danh sách đặt phòng",
                loading: false,
            });
        }
    },

    fetchBookingsWithRoomDetails: async (userId: number, forceRefresh = false) => {
        const {  bookings, loading, lastFetchedUserId, lastFetchTime, cacheValidityMs, error } = get();
        
        if (loading) {
            return;
        }

        const now = Date.now();
        const isCacheValid = lastFetchTime && (now - lastFetchTime < cacheValidityMs);
        const isSameUser = lastFetchedUserId === userId;
        const hasValidData = bookings.length > 0;
        const hasNoError = !error;

        const shouldUseCache = !forceRefresh && isSameUser && hasValidData && hasNoError && isCacheValid;
        if (shouldUseCache) {
            return;
        }

        set({ loading: true, error: null });
        try {
            const data = await getBookingsByUserApi(userId);
            
            const bookingsWithRooms = await Promise.all(
                data.map(async (booking) => {
                    try {
                        console.log("Fetching room details for room:", booking.maPhong);
                        const room = await getRoomDetailApi(booking.maPhong);
                        console.log("Successfully fetched room details for room:", booking.maPhong);
                        return {
                            ...booking,
                            room,
                            status: "confirmed" as const,
                        };
                    } catch (error) {
                        console.error("Error fetching room details for room:", booking.maPhong, error);
                        return {
                            ...booking,
                            status: "confirmed" as const,
                            room: null,
                        };
                    }
                })
            );
            
            set({
                bookings: bookingsWithRooms,
                loading: false,
                lastFetchedUserId: userId,
                lastFetchTime: Date.now(),
            });
        } catch (error) {
            console.error(error);
            set({
                error: "Không thể tải danh sách đặt phòng với thông tin phòng!",
                loading: false,
            });
        }
    },

    createBooking: async (bookingData: CreateBookingRequest) => {
        set({
            isCreatingBooking: true,
            error: null,
            createBookingSuccess: false,
        });
        try {
            const newBooking = await createBookingApi(bookingData);
            let room: any = null;
            try {
                room = await getRoomDetailApi(newBooking.maPhong);
            } catch (roomError) {
                console.warn("Không thể lấy thông tin phòng cho booking mới:", roomError);
            }

            const currentBookings = get().bookings;
            const bookingWithRoom = {
                ...newBooking,
                status: "confirmed" as const,
                room: room || null,
            };

            set({
                bookings: [bookingWithRoom, ...currentBookings],
                isCreatingBooking: false,
                createBookingSuccess: true,
                lastFetchTime: Date.now(),
            });
            return true;
        } catch (error: any) {
            console.error(error);
            let errorMessage = "Không thể đặt phòng. Vui lòng thử lại sau.";

            if (error.response?.status === 400) {
                errorMessage = "Thông tin đặt phòng không hợp lệ.";
            } else if (error.response?.status === 404) {
                errorMessage = "Phòng không tồn tại.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            set({
                error: errorMessage,
                isCreatingBooking: false,
                createBookingSuccess: false,
            });
            return false;
        }
    },

    deleteBooking: async (bookingId: number) => {
        set({ loading: true, error: null });
        try {
            await deleteBookingApi(bookingId);
            const currentBookings = get().bookings;
            const updatedBookings = currentBookings.filter(
                (booking) => booking.id !== bookingId
            );
            set({
                bookings: updatedBookings,
                loading: false,
                lastFetchTime: Date.now(),
            });
            return true;
        } catch (error: any) {
            let errorMessage = "Không thể hủy đặt phòng. Vui lòng thử lại sau.";
            if (error.response?.status === 404) {
                errorMessage = "Đặt phòng không tồn tại.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            set({
                error: errorMessage,
                loading: false,
            });
            return false;
        }
    },
}));