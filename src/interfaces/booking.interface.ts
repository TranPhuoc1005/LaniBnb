import type { Room } from "./room.interface";

export interface Booking {
    id: number;
    maPhong: number;
    ngayDen: string;
    ngayDi: string;
    soLuongKhach: number;
    maNguoiDung: number;
    room?: Room | null;
    status?: "confirmed" | "pending" | "cancelled";
}

export interface CreateBookingRequest {
    maPhong: number;
    ngayDen: string;
    ngayDi: string;
    soLuongKhach: number;
    maNguoiDung: number;
}

export interface BookingFormData {
    checkIn: string;
    checkout: string;
    guests: number;
}