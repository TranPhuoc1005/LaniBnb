import type { BaseApiResponse } from "@/interface/base.interface";
import api, { apiProvince } from "./api"
import type { LocationItem, LocationPagi, ProvinceItem } from "@/interface/location.interface";

export const listLocationApi = async (pageIndex: number, pageSize: number, keyword?: string): Promise<LocationPagi<LocationItem>> => {
    try {
        const key = keyword ? `&keyword=${keyword}` : "";
        const response = await api.get<BaseApiResponse<LocationPagi<LocationItem>>>(`vi-tri/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}${key}`);
        return response.data.content
    } catch (error) {
        console.log("🌲 ~ listLocationApi ~ error:", error)
        throw error
    }
}

export const detailLocationApi = async (id: number): Promise<LocationItem> => {
    try {
        const response = await api.get<BaseApiResponse<LocationItem>>(`vi-tri/${id}`);
        return response.data.content
    } catch (error) {
        console.log("🌲 ~ detailLocationApi ~ error:", error)
        throw error
    }
}

export const addLocationApi = async (data: LocationItem): Promise<LocationItem> => {
    try {
        const response = await api.post<BaseApiResponse<LocationItem>>(`vi-tri`, data);
        return response.data.content
    } catch (error) {
        console.log("🌲 ~ addLocationApi ~ error:", error)
        throw error
    }
}

export const removeLocationApi = async (id: number) => {
    try {
        await api.delete(`vi-tri/${id}`);
    } catch (error) {
        console.log("🌲 ~ removeLocationApi ~ error:", error)
        throw error
    }
}

export const updateLocationApi = async (id: number, data: LocationItem): Promise<LocationItem> => {
    try {
        const response = await api.put<BaseApiResponse<LocationItem>>(`vi-tri/${id}`, data);
        return response.data.content
    } catch (error) {
        console.log("🌲 ~ addLocationApi ~ error:", error)
        throw error
    }
}

export const addLocationImageApi = async (id: number, data: FormData): Promise<LocationItem> => {
    try {
        const response = await api.post<BaseApiResponse<LocationItem>>(`vi-tri/upload-hinh-vitri?maViTri=${id}`, data);
        return response.data.content
    } catch (error) {
        console.log("🌲 ~ addLocationImageApi ~ error:", error)
        throw error
    }
}

export const listProvinceApi = async (depth?: 'lv2'): Promise<ProvinceItem[]> => {
    try {
        const dt = depth ? "?depth=2" : "p/";
        const response = await apiProvince.get<ProvinceItem[]>(dt);
        return response.data
    } catch (error) {
        console.log("🌲 ~ listProvinceApi ~ error:", error)
        throw error
    }
}