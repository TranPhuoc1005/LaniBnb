import type { Comments } from "@/interfaces/comments.interface";
import api from "./api";

export const getCommentsApi = async (): Promise<Comments[]> => {
    const res = await api.get("binh-luan");
    return res.data.content;
}

export const submitCommitApi = async (comment: Omit<Comments, "id" | "tenNguoiBinhLuan" | "avatar">): Promise<Comments> => {
    // Log để debug
    console.log("Submitting comment:", comment);
    
    // Kiểm tra xem có đúng format ngày không
    const commentData = {
        maPhong: comment.maPhong,
        maNguoiBinhLuan: comment.maNguoiBinhLuan,
        ngayBinhLuan: new Date().toISOString(), 
        noiDung: comment.noiDung,
        saoBinhLuan: comment.saoBinhLuan
    };
    
    try {
        const res = await api.post("binh-luan", commentData);
        return res.data.content;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}