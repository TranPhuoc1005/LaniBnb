import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dialog } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import type { ListUser } from "@/interface/user.interface";
import AuthPopup from "./AuthPopup";
import AuthItemDetail from "./AuthItemDetail";
import { useListUserPagi } from "@/hooks/useUserQuery";
import PaginationCustom from "../_components/PaginationCustom";
import Loading from "@/components/layouts/Loading";
import { useUserManagementStore } from "@/store/userManagement.store";
import { usePaginationStore } from "@/store/pagination.store";
// import AuthPopupImg from "./AuthPopupImg";
import { SelectGroup } from "@radix-ui/react-select";
import { useDebounce } from "@/hooks/useDebounce";

export default function AuthManagement() {
    // Store
    const { isPopup, setIsPopup, setIdUser } = useUserManagementStore();
    const { userPagi, setUserPagi } = usePaginationStore();

    // State
    const [mode, setMode] = useState<"add" | "edit" | "history" | "detail" | "editImg" | null>(null);
    const [listUserCustom, setListUserCustom] = useState<ListUser[] | null>(null);

    // Handle
    const handleOpenPopup = (modeData: any) => {
        setMode(modeData)
        setIsPopup();
    }
    const handleValueOpenPopup = (data: string) => handleOpenPopup(data)

    // Form
    const { register, watch, control } = useForm<{ keyword: string, select: string }>({
        defaultValues: {
            keyword: '',
            select: 'all',
        }
    })

    const keywordSearch = watch('keyword');
    const selectSearch = watch('select');

    // API
    const debounceKeyword = useDebounce(keywordSearch, 500);
    const { data: dataListUser, isLoading: isLoadingListUser } = useListUserPagi(userPagi, 10, debounceKeyword);
    const totalPg = dataListUser?.totalRow ? Math.ceil(dataListUser?.totalRow / dataListUser?.pageSize) : 0;

    // --- Effect: Type,Search user ---
    useEffect(() => {
        let source: ListUser[] = dataListUser?.data || [];
        if (selectSearch !== 'all') {
            const filterData = source.filter((item: ListUser) => item.role.toLowerCase() === selectSearch.toLowerCase());
            source = filterData.length > 0 ? filterData : [];
        }
        setListUserCustom(source);
    }, [dataListUser, selectSearch, debounceKeyword]);
    // Search All not pagination
    // useEffect(() => {
    //     let source: ListUser[] = [];

    //     if (debounceKeyword) {
    //         source = dataSearchUser || [];
    //     } else {
    //         source = dataListUser?.data || []
    //     }

    //     if (selectSearch !== 'all') {
    //         const filterData = source.filter((item: ListUser) => item.role.toLowerCase() === selectSearch.toLowerCase());
    //         source = filterData.length > 0 ? filterData : [];
    //     }

    //     setListUserCustom(source);
    // }, [dataSearchUser, dataListUser, selectSearch, debounceKeyword]);

    return (
        <>
            <div className="relative">
                <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-5 lg:mb-8">Quản lý người dùng</h2>
                <Button
                    onClick={() => {
                        handleOpenPopup('add')
                        setIdUser(0)
                    }}
                    variant="outline" className="absolute top-0 md:top-1 right-0 flex items-center gap-2 text-white bg-pink-400 border-pink-400 font-semibold h-full p-2 md:px-3 rounded-md cursor-pointer hover:bg-white hover:text-pink-400 hover:shadow-[0_0_10px_#e396c1] transition-all duration-300"><UserPlus size={20} /> Thêm</Button>
            </div>

            <div className="mb-6 flex gap-2 sp400:gap-4">
                <div className="relative max-w-85 h-10 w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <Input placeholder="Tìm vị trí" className="h-10 p-4 ps-10 " {...register('keyword')} />
                </div>
                <div className="w-50">
                    <Controller
                        name="select"
                        control={control}
                        defaultValue="all"
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger className="w-full min-h-10">
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="user">Khách hàng</SelectItem>
                                        <SelectItem value="admin">Quản trị</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

            <div className="border border-[#eee] rounded-lg shadow-sm w-full ">
                <div className="relative overflow-x-auto rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 min-w-[1240px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 pl-6 font-medium text-gray-600 w-[7%]">Avatar</th>
                                <th className="py-3 px-4 font-medium text-gray-600 w-[13%]">Họ và tên</th>
                                <th className="py-3 px-4 font-medium text-gray-600 w-[13%]">Email</th>
                                <th className="py-3 px-4 font-medium text-gray-600 w-[11%]">Mật khẩu</th>
                                <th className="py-3 px-4 font-medium text-gray-600 w-[11%]">Ngày sinh</th>
                                <th className="py-3 px-4 font-medium text-gray-600 w-[12%]">Số điện thoại</th>
                                <th className="py-3 px-4 font-medium text-gray-600 w-[11%]">Giới tính</th>
                                <th className="py-3 px-4 font-medium text-gray-600 w-[11%]">Cấp bậc</th>
                                <th className="py-3 px-4 font-medium text-gray-600 w-[11%]">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listUserCustom && listUserCustom?.length > 0 ? (
                                listUserCustom?.map((item: ListUser, index: number) => {
                                    return <AuthItemDetail key={index} handleValueOpenPopup={handleValueOpenPopup} data={item} />
                                })
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center p-5 text-gray-400">
                                        {debounceKeyword
                                            ? `Không tìm thấy kết quả "${debounceKeyword}"`
                                            : "Không có dữ liệu"}
                                    </td>
                                </tr>
                            )
                            }
                        </tbody>
                    </table>

                    {isLoadingListUser && <Loading />}
                </div>
                <div className="flex items-center justify-between flex-col gap-3 lg:flex-row px-6 py-5 border-t border-gray-200">
                    <p className="text-gray-500 text-sm text-center">Hiển thị {listUserCustom?.length ?? 0} người dùng mỗi trang <span className="sm:inline-block hidden">-</span><br className="sm:hidden" /> Tổng cộng {dataListUser?.totalRow} người dùng</p>
                    {totalPg > 1 && <div className="block">
                        <PaginationCustom setPagi={setUserPagi} pageIndex={dataListUser?.pageIndex} pageSize={dataListUser?.pageSize} totalRow={dataListUser?.totalRow} />
                    </div>}
                </div>
            </div>
            <Dialog open={isPopup} onOpenChange={setIsPopup}>
                {mode === "add" && <AuthPopup mode="add" />}
                {mode === "edit" && <AuthPopup mode="edit" />}
                {/* {mode === "editImg" && <AuthPopupImg />} */}
            </Dialog>
        </>
    )
}
