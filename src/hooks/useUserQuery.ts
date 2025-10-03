import type { UpdateUserVars, UserPutResponse } from "@/interface/user.interface"
import { listUserPagiApi, addUserApi, removeUserApi, detailUserApi, updateUserApi, updateUserImageApi, searchUserApi, getUserApi } from "@/services/user.api"
import { useUserManagementStore } from "@/store/userManagement.store"
import { showDialog } from "@/utils/dialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useListUsers = (optional?: {}) => {
    return useQuery({
        queryKey: ['list-users'],
        queryFn: () => getUserApi(),
        staleTime: 1000 * 60 * 10, // Cache 10 phút
        ...optional
    })
}

export const useListUserPagi = (pageIndex: number, pageSize: number, key?: string, optional?: {}) => {
    return useQuery({
        queryKey: ['list-user', pageIndex, pageSize, key],
        queryFn: () => listUserPagiApi(pageIndex, pageSize, key),
        ...optional
    })
}

export const useDetailUser = (id: number, optional?: {}) => {
    return useQuery({
        queryKey: ['detail-user', id],
        queryFn: () => detailUserApi(id),
        enabled: id !== 0,
        ...optional
    })
}


export const useAddUser = (optional?: {}) => {
    const queryClient = useQueryClient();
    const { setIsPopup } = useUserManagementStore();

    return useMutation({
        mutationFn: addUserApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-user'] })
            setIsPopup()
            showDialog({
                title: 'Tạo người dùng thành công',
                icon: 'success',
            })
        },
        onError: (error: any) => {
            setIsPopup()
            showDialog({
                title: 'Tạo người dùng thất bại',
                icon: 'error',
                text: error?.response?.data?.content
            })
        },
        ...optional
    })
}

export const useRemoveUser = (optional?: {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeUserApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-user'] })
            showDialog({
                title: 'Xóa người dùng thành công',
                icon: 'success',
            })
        },
        onError: (error: any) => {
            showDialog({
                title: 'Xóa người dùng thất bại',
                icon: 'error',
                text: error?.response?.data?.content
            })
        },
        ...optional
    })
}

export const useUpdateUser = (optional?: {}) => {
    const queryClient = useQueryClient();
    const { setIsPopup } = useUserManagementStore();

    return useMutation<UserPutResponse, any, UpdateUserVars>({
        mutationFn: ({ id, data }) => updateUserApi(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-user'] })
            setIsPopup()
            showDialog({
                title: 'Cập nhật thành công',
                icon: 'success',
            })
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

export const useUpdateUserImage = (optional?: {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUserImageApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-user'] })
        },
        
        ...optional
    })
}

export const useSearchUser = (keyword: string, optional?: {}) => {
    return useQuery({
        queryKey: ['detail-user', keyword],
        queryFn: () => searchUserApi(keyword),
        enabled: !!keyword,
        ...optional
    })
}

