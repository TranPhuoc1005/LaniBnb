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
    // Log để debug
    console.log("API - Updating user with data:", userData);
    console.log("API - User ID:", userId);
    
    const res = await api.put(`users/${userId}`, userData);
    console.log("API - Update response:", res.data);
    
    return res.data.content;
}

// users.api.ts - Fixed version
export const uploadAvatarApi = async (file: File): Promise<{ avatar: string }> => {
    console.log("API - Uploading avatar:", file.name, "Size:", file.size, "Type:", file.type);
    
    const formData = new FormData();
    
    // Simplify file name creation - just use timestamp without special characters
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedFileName = `avatar_${Date.now()}.${fileExtension}`;
    
    // Option 1: Try with original file first
    formData.append('formFile', file);
    
    // Log FormData content for debugging
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
        console.log("- Key:", pair[0], "- Value:", pair[1]);
    }
    
    try {
        const res = await api.post("users/upload-avatar", formData, {
            headers: {
                // Don't set Content-Type - let browser handle multipart boundary
                // Remove any existing Content-Type to avoid conflicts
            },
            // Add timeout for large files
            timeout: 60000,
        });
        
        console.log("API - Avatar upload response:", res.data);
        return res.data.content;
    } catch (error: any) {
        console.error("API - Avatar upload error:", error);
        console.error("API - Error response:", error.response?.data);
        console.error("API - Error status:", error.response?.status);
        console.error("API - Error headers:", error.response?.headers);
        
        // If original file failed, try with sanitized file name
        if (error.response?.status === 400) {
            console.log("Retrying with sanitized file name...");
            
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
                
                console.log("API - Retry avatar upload success:", retryRes.data);
                return retryRes.data.content;
            } catch (retryError: any) {
                console.error("API - Retry also failed:", retryError);
                throw retryError;
            }
        }
        
        throw error;
    }
}