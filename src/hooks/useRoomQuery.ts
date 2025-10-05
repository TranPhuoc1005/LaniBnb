import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { addRoomApi, addRoomImageApi, detailRoomApi, listRoomApi, locationOfRoomApi, removeRoomApi, updateRoomApi } from "@/services/room.api"
import { showDialog } from "@/utils/dialog"
import { roomManagementStore } from "@/store/roomManagement.store"
import type { RoomItem } from "@/interface/room.interface"
import { useMemo } from "react"

export const useListRoom = (pageIndex: number, pageSize: number, keyword?: string, optional?: {}) => {
    return useQuery({
        queryKey: ['list-room', pageIndex, pageSize, keyword],
        queryFn: () => listRoomApi(pageIndex, pageSize, keyword),
        enabled: !!pageIndex,
        ...optional
    })
}

export const useDetailRoom = (id: number, optional?: {}) => {
    return useQuery({
        queryKey: ['detail-room', id],
        queryFn: () => detailRoomApi(id),
        enabled: id !== 0,
        ...optional
    })
}

export const useLocationOfRoom = (id: number, optional?: {}) => {
    return useQuery({
        queryKey: ['location-room', id],
        queryFn: () => locationOfRoomApi(id),
        enabled: !!id,
        ...optional
    })
}

export const useBookingsWithRoomDetails = (bookings: any[] = []) => {
    const roomQueries = useQueries({
        queries: bookings.map((booking) => ({
            queryKey: ['detail-room', booking.maPhong],
            queryFn: () => detailRoomApi(booking.maPhong),
            enabled: !!booking.maPhong,
            staleTime: 5 * 60 * 1000, // Cache 5 phút
        }))
    });

    const bookingsWithRooms = useMemo(() => {
        return bookings.map((booking, index) => ({
            ...booking,
            room: roomQueries[index]?.data || null
        }));
    }, [bookings, roomQueries]);

    const isLoading = roomQueries.some(query => query.isLoading);
    const hasError = roomQueries.some(query => query.isError);

    return {
        data: bookingsWithRooms,
        isLoading,
        hasError
    };
}

export const useAddRoom = (optional?: {}) => {
    const queryClient = useQueryClient();
    const { setIsPopup } = roomManagementStore();

    return useMutation({
        mutationFn: addRoomApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-room'] })
            setIsPopup()
            showDialog({
                title: 'Thêm phòng thành công',
                icon: 'success',
            })
        },
        onError: (error: any) => {
            setIsPopup()
            showDialog({
                title: 'Thêm phòng thất bại',
                icon: 'error',
                text: error?.response?.data?.content
            })
        },
        ...optional
    })
}

export const useRemoveRoom = (optional?: {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeRoomApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-room'] })
            showDialog({
                title: 'Xóa phòng thành công',
                icon: 'success',
            })
        },
        onError: (error: any) => {
            showDialog({
                title: 'Xóa phòng thất bại',
                icon: 'error',
                text: error?.response?.data?.content
            })
        },
        ...optional
    })
}

export const useUpdateRoom = (optional?: {}) => {
    const queryClient = useQueryClient();
    const { setIsPopup } = roomManagementStore();
    return useMutation<RoomItem, any, { id: number, data: RoomItem }>({
        mutationFn: ({ id, data }) => updateRoomApi(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-room'] })
            setIsPopup()
            showDialog({
                title: 'Cập nhật phòng thành công',
                icon: 'success',
            })
        },
        onError: (error: any) => {
            setIsPopup()
            showDialog({
                title: 'Cập nhật phòng thất bại',
                icon: 'error',
                text: error?.response?.data?.content
            })
        },
        ...optional
    })
}

export const useAddImageRoom = (optional?: {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: FormData }) => addRoomImageApi(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-room'] })
        },
        ...optional
    })
}