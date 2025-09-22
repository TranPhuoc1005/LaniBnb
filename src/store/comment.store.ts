import type { Comments } from "@/interfaces/comments.interface"
import type { User } from "@/interfaces/users.interface";
import { getCommentsApi, submitCommitApi } from "@/services/comments.api";
import { getUserApi } from "@/services/users.api";
import { create } from "zustand";

type CommentStore = {
    comments: Comments[],
    users: User[],
    loading: boolean,
    usersLoading: boolean,
    error: string | null,
    usersError: string | null,

    setComments: (comments: Comments[]) => void,
    setUsers: (users: User[]) => void,
    setLoading: (loading: boolean) => void,
    setUsersLoading: (usersLoading: boolean) => void,
    setError: (error: string | null) => void,
    setUsersError: (usersError: string | null) => void,

    fetchComments: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    fetchAll: () => Promise<void>;
    submitComment: (comment: Omit<Comments, "id" | "tenNguoiBinhLuan" | "avatar">) => Promise<boolean>;
}

export const useCommentStore = create<CommentStore>((set, get) => ({
    comments: [],
    users: [],
    loading: false,
    usersLoading: false,
    error: null,
    usersError: null,

    setComments: (comments) => set({comments}),
    setUsers: (users) => set({users}),
    setLoading: (loading) => set({loading}),
    setUsersLoading: (loading) => set({usersLoading: loading}),
    setError: (error) => set({error}),
    setUsersError: (error) => set({usersError: error}),

    fetchComments: async () => {
        set({loading: true, error: null});
        try {
            const data = await getCommentsApi();
            set({comments: data, loading: false});
        } catch (error) {
            console.error("Fetch comments error:", error);
            set({
                error: "Không thể tải danh sách bình luận.",
                loading: false
            })
        }
    },

    fetchUsers: async () => {
        set({usersLoading: true, usersError: null});
        try {
            const data = await getUserApi();
            set({users: data, usersLoading:false});
        } catch (error) {
            console.error("Fetch users error:", error);
            set({
                usersError: "Không thể tải danh sách người dùng.",
                usersLoading: false
            })
        }
    },

    fetchAll: async () => {
        const { fetchComments, fetchUsers } = get();
        await Promise.all([fetchComments(), fetchUsers()]);
    },

    submitComment: async (comment: Omit<Comments, "id" | "tenNguoiBinhLuan" | "avatar">) => {
        set({loading: true, error: null});
        
        try {
            console.log("Submitting comment with data:", comment);
            
            // Validate required fields
            if (!comment.maPhong || !comment.maNguoiBinhLuan || !comment.noiDung?.trim()) {
                throw new Error("Thiếu thông tin bắt buộc");
            }
            
            // Ensure proper data types
            const sanitizedComment = {
                maPhong: Number(comment.maPhong),
                maNguoiBinhLuan: Number(comment.maNguoiBinhLuan),
                ngayBinhLuan: new Date().toISOString(),
                noiDung: comment.noiDung.trim(),
                saoBinhLuan: Number(comment.saoBinhLuan)
            };
            
            const newComment = await submitCommitApi(sanitizedComment);
            
            const {comments} = get();
            set({
                comments: [newComment, ...comments],
                loading: false
            });
            
            console.log("Comment submitted successfully:", newComment);
            return true;
            
        } catch (error: any) {
            console.error("Submit comment error:", error);
            
            let errorMessage = "Không thể gửi bình luận!";
            
            if (error?.response?.status === 403) {
                errorMessage = "Bạn không có quyền thực hiện hành động này. Vui lòng đăng nhập lại.";
            } else if (error?.response?.status === 401) {
                errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            } else if (error?.response?.status === 400) {
                errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            set({
                error: errorMessage,
                loading: false
            });
            
            return false;
        }
    }
}))