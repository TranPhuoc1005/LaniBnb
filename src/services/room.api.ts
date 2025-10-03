import type { BaseApiResponse } from "@/interface/base.interface"
import type { RoomItem, RoomPagi } from "@/interface/room.interface"
import api from "./api"

export const listRoomApi = async (pageIndex: number, pageSize: number, keyword?: string): Promise<RoomPagi<RoomItem>> => {
    try {
        const key = keyword ? `&keyword=${keyword}` : '';
        const response = await api.get<BaseApiResponse<RoomPagi<RoomItem>>>(`phong-thue/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}${key}`);
        return response.data.content
    } catch (error) {
        console.log("🌲 ~ listRoomApi ~ error:", error)
        throw error
    }
}

export const detailRoomApi = async (id: number): Promise<RoomItem> => {
    try {
        const response = await api.get<BaseApiResponse<RoomItem>>(`phong-thue/${id}`)
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ detailRoomApi ~ error:", error)
        throw error
    }
}

export const locationOfRoomApi = async (id: number): Promise<RoomItem[]> => {
    try {
        const response = await api.get<BaseApiResponse<RoomItem[]>>(`phong-thue/lay-phong-theo-vi-tri?maViTri=${id}`)
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ detailRoomApi ~ error:", error)
        throw error
    }
}

export const addRoomApi = async (data: RoomItem): Promise<RoomItem> => {
    try {
        const response = await api.post<BaseApiResponse<RoomItem>>('phong-thue', data);
        return response.data.content
    } catch (error) {
        console.log("🌲 ~ addRoomApi ~ error:", error)
        throw error
    }
}

export const removeRoomApi = async (id: number) => {
    try {
        await api.delete(`phong-thue/${id}`);
    } catch (error) {
        console.log("🌲 ~ removeRoomApi ~ error:", error)
        throw error
    }
}

export const updateRoomApi = async (id: number, data: RoomItem): Promise<RoomItem> => {
    try {
        const response = await api.put<BaseApiResponse<RoomItem>>(`phong-thue/${id}`, data);
        return response.data.content
    } catch (error) {
        console.log("🌲 ~ updateRoomApi ~ error:", error)
        throw error
    }
}

export const addRoomImageApi = async (id: number, data: FormData): Promise<RoomItem> => {
    try {
        const response = await api.post<BaseApiResponse<RoomItem>>(`phong-thue/upload-hinh-phong?maPhong=${id}`, data);
        return response.data.content
    } catch (error) {
        console.log("🌲 ~ addRoomImageApi ~ error:", error)
        throw error
    }
}