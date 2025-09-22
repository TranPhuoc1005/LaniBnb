import api from "./api"
import type { Location } from "@/interfaces/location.interface"

export const getLocationsApi = async (): Promise<Location[]> => {
    const res = await api.get('vi-tri');
    return res.data.content;
}

export const getLocationDetailApi = async (id:number): Promise<Location> => {
    const res = await api.get(`vi-tri/${id}`);
    return res.data.content;
}