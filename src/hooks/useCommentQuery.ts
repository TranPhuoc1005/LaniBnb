import type { UseMutationOptions } from "@tanstack/react-query";
import type { CommentItem } from "@/interface/comment.interface";
import {
    getCommentsApi,
    listOfRoomCommentApi,
    removeOfRoomCommentApi,
    submitCommitApi,
} from "@/services/comment.api";
import { showDialog } from "@/utils/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useListOfRoomComment = (id: number, optional?: {}) => {
    return useQuery({
        queryKey: ["list-of-room-comment", id],
        queryFn: () => listOfRoomCommentApi(id),
        enabled: id !== 0,
        ...optional,
    });
};

export const useListComments = (optional?: {}) => {
    return useQuery({
        queryKey: ["list-comments"],
        queryFn: () => getCommentsApi(),
        staleTime: 1000 * 60 * 5, // Cache 5 phút
        ...optional,
    });
};

export const useRemoveOfRoomComment = (optional?: {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeOfRoomCommentApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["list-of-room-comment"],
            });
            showDialog({
                title: "Xóa bình luận thành công",
                icon: "success",
            });
        },
        onError: () => {
            showDialog({
                title: "Xóa bình luận thất bại",
                icon: "error",
            });
        },
        ...optional,
    });
};

type CommentInput = Omit<CommentItem, "id" | "tenNguoiBinhLuan" | "avatar">;
export const useSubmitComment = (
    optional?: Omit<
        UseMutationOptions<CommentItem, any, CommentInput>,
        "mutationFn"
    >
) => {
    const queryClient = useQueryClient();
    const { onSuccess, onError, ...restOptional } = optional || {};

    return useMutation<CommentItem, any, CommentInput>({
        mutationFn: async (comment) => {
            if (
                !comment.maPhong ||
                !comment.maNguoiBinhLuan ||
                !comment.noiDung?.trim()
            ) {
                throw new Error("Thiếu thông tin bắt buộc");
            }

            const sanitizedComment = {
                maPhong: Number(comment.maPhong),
                maNguoiBinhLuan: Number(comment.maNguoiBinhLuan),
                ngayBinhLuan: new Date().toISOString(),
                noiDung: comment.noiDung.trim(),
                saoBinhLuan: Number(comment.saoBinhLuan),
            };

            return await submitCommitApi(sanitizedComment);
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ["list-comments"] });
            queryClient.invalidateQueries({
                queryKey: ["list-of-room-comment"],
            });

            showDialog({
                title: "Gửi bình luận thành công",
                icon: "success",
            });

            onSuccess?.(data, variables, context);
        },
        onError: (error: any, variables, context) => {
            let errorMessage = "Không thể gửi bình luận!";

            if (error?.response?.status === 403) {
                errorMessage =
                    "Bạn không có quyền thực hiện hành động này. Vui lòng đăng nhập lại.";
            } else if (error?.response?.status === 401) {
                errorMessage =
                    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            } else if (error?.response?.status === 400) {
                errorMessage =
                    "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            showDialog({
                title: "Gửi bình luận thất bại",
                icon: "error",
                text: errorMessage,
            });

            onError?.(error, variables, context);
        },
        ...restOptional,
    });
};
