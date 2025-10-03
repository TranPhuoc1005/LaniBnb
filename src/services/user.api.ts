import type { BaseApiResponse } from "@/interface/base.interface";
import api from "./api"
import type { ListUser, ListUserPagi, UserPostResponse, UserPutResponse } from "@/interface/user.interface";

export const getUserApi = async (): Promise<ListUser[]> => {
    const res = await api.get("users");
    return res.data.content;
}

export const listUserPagiApi = async (pageIndex: number, pageSize: number, keyword?: string): Promise<ListUserPagi<ListUser>> => {
    try {
        const key = keyword ? `&keyword=${keyword}` : '';
        const response = await api.get<BaseApiResponse<ListUserPagi<ListUser>>>(`users/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}${key}`);
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ userPagiApi ~ error:", error)
        throw error
    }
}

export const detailUserApi = async (id: number) => {
    try {
        const response = await api.get<BaseApiResponse<ListUser>>(`users/${id}`);
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ userPagiApi ~ error:", error)
        throw error
    }
}

export const addUserApi = async (data: UserPostResponse): Promise<UserPostResponse> => {
    try {
        const response = await api.post<BaseApiResponse<UserPostResponse>>(`users`, data);
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ addUserApi ~ error:", error)
        throw error
    }
}

export const removeUserApi = async (id: number) => {
    try {
        await api.delete(`users?id=${id}`);
    } catch (error) {
        console.log("🌲 ~ removeUserApi ~ error:", error)
        throw error
    }
}

export const updateUserApi = async (id: number, data: UserPutResponse): Promise<UserPutResponse> => {
    try {
        const response = await api.put<BaseApiResponse<UserPutResponse>>(`users/${id}`, data);
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ updateUserApi ~ error:", error)
        throw error
    }
}

export const updateUserImageApi = async (data: FormData) => {
    try {
        const response = await api.post<BaseApiResponse<ListUser>>(`users/upload-avatar`, data);
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ updateUserImageApi ~ error:", error)
        throw error
    }
}

export const searchUserApi = async (keyword: any): Promise<ListUser[]> => {
    try {
        const response = await api.get<BaseApiResponse<ListUser[]>>(`users/search/${keyword}`);
        return response.data.content;
    } catch (error) {
        console.log("🌲 ~ updateUserImageApi ~ error:", error)
        throw error
    }
}



