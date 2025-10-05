import { useQuery } from "@tanstack/react-query";
import { getUserApi } from "@/services/user.api";
import { listRoomApi } from "@/services/room.api";
import { getCommentsApi } from "@/services/comment.api";

export const useStats = (optional?: {}) => {
    const usersQuery = useQuery({
        queryKey: ['stats-users'],
        queryFn: () => getUserApi(),
        staleTime: 1000 * 60 * 5, // Cache 5 phút
        ...optional
    });

    // Lấy danh sách rooms 
    const roomsQuery = useQuery({
        queryKey: ['stats-rooms'],
        queryFn: () => listRoomApi(1, 10000), 
        staleTime: 1000 * 60 * 5,
        ...optional
    });

    // Lấy danh sách comments
    const commentsQuery = useQuery({
        queryKey: ['stats-comments'],
        queryFn: () => getCommentsApi(),
        staleTime: 1000 * 60 * 5,
        ...optional
    });

    // Tính toán thống kê
    const stats = {
        totalCustomers: usersQuery.data?.length || 0,
        totalRooms: roomsQuery.data?.data?.length || 0,
        averageRating: (() => {
            const comments = commentsQuery.data || [];
            if (comments.length === 0) return 0;
            
            const totalRating = comments.reduce((sum: number, comment: any) => {
                return sum + (comment.saoBinhLuan || 0);
            }, 0);
            
            return (totalRating / comments.length).toFixed(1);
        })(),
        totalReviews: commentsQuery.data?.length || 0,
        isLoading: usersQuery.isLoading || roomsQuery.isLoading || commentsQuery.isLoading,
        isError: usersQuery.isError || roomsQuery.isError || commentsQuery.isError,
    };

    return stats;
};