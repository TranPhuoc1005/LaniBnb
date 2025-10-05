import type { BookingItem, CreateBookingRequest } from "@/interface/booking.interface"
import { addBookingApi, detailBookingApi, detailUserBookingApi, listBookingApi, removeBookingApi, updateBookingApi } from "@/services/booking.api"
import { useBookingManagementStore } from "@/store/bookingManagement.store"
import { showDialog } from "@/utils/dialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useListBooking = (optional?: {}) => {
    return useQuery({
        queryKey: ['detail-user-booking'],
        queryFn: () => listBookingApi(),
        ...optional
    })
}

export const useDetailUserBooking = (id: string, optional?: {}) => {
    return useQuery({
        queryKey: ['detail-user-booking', id],
        queryFn: () => detailUserBookingApi(id),
        enabled: !!id,
        ...optional
    })
}

export const useCreateBooking = (optional?: {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BookingItem) => addBookingApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-booking'] });
            queryClient.invalidateQueries({ queryKey: ['user-booking'] });
        },
        ...optional
    });
};

export const useDetailBooking = (id: number, optional?: {}) => {
    return useQuery({
        queryKey: ['detail-booking', id],
        queryFn: () => detailBookingApi(id),
        enabled: id !== 0,
        ...optional
    })
}

export const useAddBooking = (optional?: {}) => {
    const queryClient = useQueryClient();
    const { setIsPopup } = useBookingManagementStore();
    return useMutation({
        mutationFn: addBookingApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['detail-user-booking'] })
            showDialog({
                title: 'Thêm thành công',
                icon: 'success',
            })
            setIsPopup()
        },
        onError: (error: any) => {
            setIsPopup()
            showDialog({
                title: 'Thêm thất bại',
                icon: 'error',
                text: error?.response?.data?.content
            })
        },
        ...optional
    })
}

export const useRemoveBooking = (optional?: {}) => {
    const queryClient = useQueryClient();
    const { setIsPopup } = useBookingManagementStore();
    return useMutation({
        mutationFn: removeBookingApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['detail-user-booking'] })
            showDialog({
                title: 'Xoá thành công',
                icon: 'success',
            })
        },
        onError: (error: any) => {
            setIsPopup()
            showDialog({
                title: 'Xóa thất bại',
                icon: 'error',
                text: error?.response?.data?.content
            })
        },
        ...optional
    })
}

export const useUpdateBooking = (optional?: {}) => {
    const queryClient = useQueryClient();
    const { setIsPopup } = useBookingManagementStore();
    return useMutation<BookingItem, any, { id: number, data: BookingItem }>({
        mutationFn: ({ id, data }) => updateBookingApi(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['detail-user-booking'] })
            showDialog({
                title: 'Cập nhật thành công',
                icon: 'success',
            })
            setIsPopup()
        },
        onError: (error: any) => {
            setIsPopup()
            showDialog({
                title: 'Cập nhật thất bại',
                icon: 'error',
                text: error?.response?.data?.content
            })
        },
        ...optional
    })
}