import type { User } from "@/interfaces/users.interface";
import api from "./api";

export const getUserApi = async (): Promise<User[]> => {
    const res = await api.get("users");
    return res.data.content;
}

export const getUserByIdApi = async (userId: number): Promise<User> => {
    const res = await api.get(`users/${userId}`);
    return res.data.content;
}

export const updateUserApi = async (userId: number, userData: Partial<User>): Promise<User> => {
    const res = await api.put(`users/${userId}`, userData);
    return res.data.content;
}

export const uploadAvatarApi = async (file: File): Promise<{ avatar: string }> => {
    const formData = new FormData();
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedFileName = `avatar_${Date.now()}.${fileExtension}`;
    
    formData.append('formFile', file);
    for (let pair of formData.entries()) {
        console.log("- Key:", pair[0], "- Value:", pair[1]);
    }
    
    try {
        const res = await api.post("users/upload-avatar", formData, {
            timeout: 60000,
        });
        
        console.log("API - Avatar upload response:", res.data);
        return res.data.content;
    } catch (error: any) {
        if (error.response?.status === 400) {
            try {
                const sanitizedFile = new File([file], sanitizedFileName, {
                    type: file.type,
                    lastModified: file.lastModified,
                });
                
                const retryFormData = new FormData();
                retryFormData.append('formFile', sanitizedFile);
                
                const retryRes = await api.post("users/upload-avatar", retryFormData, {
                    headers: {},
                    timeout: 60000,
                });
                return retryRes.data.content;
            } catch (retryError: any) {
                throw retryError;
            }
        }
        throw error;
    }
}