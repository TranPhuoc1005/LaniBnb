import type { Booking, CreateBookingRequest } from "@/interfaces/booking.interface";
import api from "./api";

export const getBookingsByUserApi = async (userId: number): Promise<Booking[]> => {
    const res = await api.get(`dat-phong/lay-theo-nguoi-dung/${userId}`);
    return res.data.content;
}

export const getAllBookingsApi = async (): Promise<Booking[]> => {
    const res = await api.get("dat-phong");
    return res.data.content;
}

export const createBookingApi = async (bookingData: CreateBookingRequest): Promise<Booking> => {
    const res = await api.post("dat-phong", bookingData);
    return res.data.content;
}

export const deleteBookingApi = async (bookingId: number): Promise<void> => {
    await api.delete(`dat-phong/${bookingId}`);
}

export const updateBookingApi = async (bookingId: number, bookingData: Partial<CreateBookingRequest>): Promise<Booking> => {
    const res = await api.put(`dat-phong/${bookingId}`, bookingData);
    return res.data.content;
}