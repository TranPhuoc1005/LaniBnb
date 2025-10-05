import type { CommentItem } from "@/interface/comment.interface"
import api from "./api"
import type { BaseApiResponse } from "@/interface/base.interface"


export const getCommentsApi = async (): Promise<CommentItem[]> => {
    const res = await api.get("binh-luan");
    return res.data.content;
}

export const submitCommitApi = async (comment: Omit<CommentItem, "id" | "tenNguoiBinhLuan" | "avatar">): Promise<CommentItem> => {
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

export const listOfRoomCommentApi = async (id: number): Promise<CommentItem[]> => {
    try {
        const response = await api.get<BaseApiResponse<CommentItem[]>>(`binh-luan/lay-binh-luan-theo-phong/${id}`)
        return response.data.content
    } catch (error) {
        console.log("🌲 ~ listOfRoomCommentApi ~ error:", error)
        throw error
    }
}

export const removeOfRoomCommentApi = async (id: number) => {
    try {
        await api.delete(`binh-luan/${id}`)
    } catch (error) {
        console.log("🌲 ~ removeOfRoomCommentApi ~ error:", error)
        throw error
    }
}


