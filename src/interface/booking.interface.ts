import type { RoomItem } from "./room.interface";

export interface BookingItem {
    id: number;
    maPhong: number;
    ngayDen: string;
    ngayDi: string;
    soLuongKhach: number;
    maNguoiDung: number;

    room?: RoomItem | null;
    status?: "confirmed" | "pending" | "cancelled";
}

export interface CreateBookingRequest {
    maPhong: number;
    ngayDen: string;
    ngayDi: string;
    soLuongKhach: number;
    maNguoiDung: number;
}