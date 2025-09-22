import type {
    Booking,
    CreateBookingRequest,
} from "@/interfaces/booking.interface";
import {
    createBookingApi,
    deleteBookingApi,
    getBookingsByUserApi,
} from "@/services/booking.api";
import { getRoomDetailApi } from "@/services/room.api";
import { create } from "zustand";

type BookingStore = {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
    isCreatingBooking: boolean;
    createBookingSuccess: boolean;

    setBookings: (booking: Booking[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setCreateBookingSuccess: (success: boolean) => void;
    clearError: () => void;

    fetchUserBookings: (userId: number) => Promise<void>;
    fetchBookingsWithRoomDetails: (userId: number) => Promise<void>;

    createBooking: (bookingData: CreateBookingRequest) => Promise<boolean>;
    deleteBooking: (bookingId: number) => Promise<boolean>;
};

export const useBookingStore = create<BookingStore>((set, get) => ({
    bookings: [],
    loading: false,
    error: null,
    isCreatingBooking: false,
    createBookingSuccess: false,

    setBookings: (bookings) => set({ bookings }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setCreateBookingSuccess: (success) =>
        set({ createBookingSuccess: success }),
    clearError: () => set({ error: null, createBookingSuccess: false }),

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
            });
        } catch (error) {
            console.error("Error fetching bookings:", error);
            set({
                error: "Không thể tải danh sách đặt phòng",
                loading: false,
            });
        }
    },

    fetchBookingsWithRoomDetails: async (userId: number) => {
        set({ loading: true, error: null });
        try {
            const data = await getBookingsByUserApi(userId);
            console.log("Raw booking data:", data);

            const bookingsWithRooms = await Promise.all(
                data.map(async (booking) => {
                    try {
                        console.log(
                            `Fetching room details for maPhong: ${booking.maPhong}`
                        );
                        const room = await getRoomDetailApi(booking.maPhong);
                        console.log(
                            `Room data for booking ${booking.id}:`,
                            room
                        );
                        return {
                            ...booking,
                            room,
                            status: "confirmed" as const,
                        };
                    } catch (error) {
                        console.warn(
                            `Không thể lấy thông tin phòng ${booking.maPhong}:`,
                            error
                        );
                        return {
                            ...booking,
                            status: "confirmed" as const,
                            room: null,
                        };
                    }
                })
            );

            console.log("Final bookings with rooms:", bookingsWithRooms);
            set({
                bookings: bookingsWithRooms,
                loading: false,
            });
        } catch (error) {
            console.error("Error in fetchBookingsWithRoomDetails:", error);
            set({
                error: "Không thể tải danh sách đặt phòng với thông tin phòng!",
                loading: false,
            });
        }
    },

    createBooking: async (bookingData: CreateBookingRequest) => {
        console.log("Creating booking with data:", bookingData);
        set({
            isCreatingBooking: true,
            error: null,
            createBookingSuccess: false,
        });
        try {
            const newBooking = await createBookingApi(bookingData);
            console.log("Created booking response:", newBooking);

            let room: any = null;
            try {
                room = await getRoomDetailApi(newBooking.maPhong);
                console.log("Room data for new booking:", room);
            } catch (roomError) {
                console.warn(
                    "Không thể lấy thông tin phòng cho booking mới:",
                    roomError
                );
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
            });
            return true;
        } catch (error: any) {
            console.error("Error creating booking:", error);
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
            console.log(`Deleting booking with ID: ${bookingId}`);
            await deleteBookingApi(bookingId);

            const currentBookings = get().bookings;
            const updatedBookings = currentBookings.filter(
                (booking) => booking.id !== bookingId
            );

            console.log(
                `Deleted booking ${bookingId}, remaining bookings:`,
                updatedBookings.length
            );
            set({
                bookings: updatedBookings,
                loading: false,
            });
            return true;
        } catch (error: any) {
            console.error("Error deleting booking:", error);
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
