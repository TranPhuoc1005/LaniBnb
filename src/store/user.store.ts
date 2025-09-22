import type { User } from "@/interfaces/users.interface";
import {
    getUserByIdApi,
    updateUserApi,
    uploadAvatarApi,
} from "@/services/users.api";
import { create } from "zustand";

type UserStore = {
    currentUser: User | null;
    loading: boolean;
    error: string | null;
    isUpdating: boolean;
    updateSuccess: boolean;
    isUploadingAvatar: boolean;

    setCurrentUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setUpdateSuccess: (success: boolean) => void;
    clearError: () => void;
    loadUserFromStorage: () => User | null;

    fetchUserById: (userId: number) => Promise<void>;
    updateUserInfo: (userId: number, userData: Partial<User>) => Promise<boolean>;
    uploadAvatar: (file: File) => Promise<string | null>;
};

export const useUserStore = create<UserStore>((set, get) => ({
    currentUser: null,
    loading: false,
    error: null,
    isUpdating: false,
    updateSuccess: false,
    isUploadingAvatar: false,

    setCurrentUser: (user) => set({ currentUser: user }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setUpdateSuccess: (success) => set({ updateSuccess: success }),
    clearError: () => set({ error: null, updateSuccess: false }),

    loadUserFromStorage: () => {
        try {
            const authStorage = localStorage.getItem("auth-storage");
            if (authStorage) {
                const authData = JSON.parse(authStorage);
                if (authData?.state?.user) {
                    console.log("Loaded user from localStorage:", authData.state.user);
                    set({ currentUser: authData.state.user });
                    return authData.state.user;
                }
            }
        } catch (error) {
            console.warn("Could not load user from localStorage:", error);
        }
        return null;
    },

    fetchUserById: async (userId: number) => {
        set({ loading: true, error: null });
        try {
            const user = await getUserByIdApi(userId);
            console.log("Fetched user:", user);
            set({
                currentUser: user,
                loading: false,
            });
        } catch (error) {
            console.error("Error fetching user:", error);
            set({
                error: "Không thể tải thông tin người dùng",
                loading: false,
            });
        }
    },

    updateUserInfo: async (userId: number, userData: Partial<User>) => {
        console.log("Updating user with data:", userData);
        set({
            isUpdating: true,
            error: null,
            updateSuccess: false,
        });
        
        try {
            const updatedUser = await updateUserApi(userId, userData);
            console.log("Updated user response:", updatedUser);

            const currentUser = get().currentUser;
            const finalUser = currentUser ? { ...currentUser, ...userData } : updatedUser;

            set({
                currentUser: finalUser,
                isUpdating: false,
                updateSuccess: true,
            });

            try {
                const authStorage = localStorage.getItem("auth-storage");
                if (authStorage) {
                    const authData = JSON.parse(authStorage);
                    if (authData?.state?.user) {
                        authData.state.user = { ...authData.state.user, ...userData };
                        localStorage.setItem("auth-storage", JSON.stringify(authData));
                        console.log("Updated localStorage auth data");
                    }
                }
            } catch (storageError) {
                console.warn("Could not update localStorage:", storageError);
            }

            return true;
        } catch (error: any) {
            console.error("Error updating user:", error);
            let errorMessage = "Không thể cập nhật thông tin. Vui lòng thử lại sau.";

            if (error.response?.status === 400) {
                errorMessage = "Thông tin không hợp lệ.";
            } else if (error.response?.status === 404) {
                errorMessage = "Người dùng không tồn tại.";
            } else if (error.response?.status === 409) {
                errorMessage = "Email đã được sử dụng bởi tài khoản khác.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            set({
                error: errorMessage,
                isUpdating: false,
                updateSuccess: false,
            });
            return false;
        }
    },

    uploadAvatar: async (file: File) => {
        console.log("Uploading avatar:", file.name);
        set({
            isUploadingAvatar: true,
            error: null,
        });
        
        try {
            const result = await uploadAvatarApi(file);
            console.log("Avatar upload response:", result);

            const currentUser = get().currentUser;
            if (currentUser && result.avatar) {
                set({
                    currentUser: {
                        ...currentUser,
                        avatar: result.avatar
                    },
                });
            }

            set({
                isUploadingAvatar: false,
            });

            return result.avatar || null;
        } catch (error: any) {
            console.error("Error uploading avatar:", error);
            console.error("Error response data:", error.response?.data);
            
            let errorMessage = "Không thể tải lên ảnh đại diện. Vui lòng thử lại sau.";

            if (error.response?.status === 400) {
                if (error.response?.data?.message) {
                    errorMessage = `Lỗi: ${error.response.data.message}`;
                } else {
                    errorMessage = "Định dạng ảnh không hợp lệ. Hãy thử với file JPG hoặc PNG khác.";
                }
            } else if (error.response?.status === 413) {
                errorMessage = "Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.";
            } else if (error.response?.status === 415) {
                errorMessage = "Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG, GIF.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            set({
                error: errorMessage,
                isUploadingAvatar: false,
            });
            return null;
        }
    },
}));