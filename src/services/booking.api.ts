import type { BaseApiResponse } from "@/interface/base.interface"
import type { BookingItem, CreateBookingRequest } from "@/interface/booking.interface"
import api from "./api"

export const listBookingApi = async (): Promise<BookingItem[]> => {
    try {
        const response = await api.get<BaseApiResponse<BookingItem[]>>(`dat-phong/`)
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ listBookingApi ~ error:", error)
        throw error
    }
}

export const detailUserBookingApi = async (id: string): Promise<BookingItem[]> => {
    try {
        const response = await api.get<BaseApiResponse<BookingItem[]>>(`dat-phong/lay-theo-nguoi-dung/${id}`)
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ detailUserBookingApi ~ error:", error)
        throw error
    }
}

export const detailBookingApi = async (id: number): Promise<BookingItem> => {
    try {
        const response = await api.get<BaseApiResponse<BookingItem>>(`dat-phong/${id}`)
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ detailBookingApi ~ error:", error)
        throw error
    }
}

export const addBookingApi = async (data: BookingItem): Promise<BookingItem> => {
    try {
        const response = await api.post<BaseApiResponse<BookingItem>>(`dat-phong/`, data)
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ addBookingApi ~ error:", error)
        throw error
    }
}

export const removeBookingApi = async (id: string) => {
    try {
        await api.delete<BaseApiResponse<BookingItem[]>>(`dat-phong/${id}`)
    } catch (error) {
        console.log("🌲 ~ removeBookingApi ~ error:", error)
        throw error
    }
}

export const updateBookingApi = async (id: number, data: BookingItem): Promise<BookingItem> => {
    try {
        const response = await api.put<BaseApiResponse<BookingItem>>(`dat-phong/${id}`, data)
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ updateBookingApi ~ error:", error)
        throw error
    }
}

export const createBookingApi = async (bookingData: CreateBookingRequest): Promise<BookingItem> => {
    const res = await api.post("dat-phong", bookingData);
    return res.data.content;
}