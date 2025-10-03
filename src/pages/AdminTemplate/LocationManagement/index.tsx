import { MapPinPlusInside } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dialog } from "@/components/ui/dialog";
import { LocationPopup } from "./LocationPopup";
import LocationItemDetail from "./LocationItemDetail";
import { useListLocation, useListProvince } from "@/hooks/useLocationQuery";
import { locationManagementStore } from "@/store/locationManagement.store";
import PaginationCustom from "../_components/PaginationCustom";
import { usePaginationStore } from "@/store/pagination.store";
import { useDebounce } from "@/hooks/useDebounce";
import { useForm, Controller } from "react-hook-form";
import type { LocationItem, ProvinceItem } from "@/interface/location.interface";

export default function LocationManagement() {
    // Store
    const { isPopup, setIsPopup, setIdLocation } = locationManagementStore()
    const { locationPagi, setLocationPagi } = usePaginationStore();

    // State
    const [mode, setMode] = useState<"add" | "edit" | null>(null);
    const [listLocationFS, setListLocationFS] = useState<LocationItem[] | null>(null);

    // handle
    const handleOpenPopup = (modeData: any) => {
        setMode(modeData)
        setIsPopup()
    }
    const handleValueOpenPopup = (data: string) => {
        handleOpenPopup(data)
    }

    // Form
    const { register, watch, control } = useForm<{ keyword: string, select: string }>({
        defaultValues: {
            keyword: '',
            select: 'all'
        }
    })

    const keywordSearch = watch('keyword');
    const selectSearch = watch('select');
    // API
    const keyworDebounce = useDebounce(keywordSearch, 500)
    const { data: dataListLocation, } = useListLocation(locationPagi, 21, keyworDebounce);
    const { data: dataListProvince } = useListProvince();
    const totalPg = dataListLocation?.totalRow ? Math.ceil(dataListLocation?.totalRow / dataListLocation?.pageSize) : 0;

    // Filter && Search
    useEffect(() => {
        let arrFs = dataListLocation?.data || [];
        if (selectSearch !== 'all') {
            const filterArr = arrFs.filter((item) => item.tinhThanh.toLocaleLowerCase() === selectSearch.toLocaleLowerCase())
            arrFs = filterArr.length > 0 ? filterArr : [];
        }
        setListLocationFS(arrFs)
    }, [keyworDebounce, selectSearch, dataListLocation]);


    return (
        <>
            <div className="relative">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-5 lg:mb-8">Quản lý vị trí</h2>
                <Button
                    onClick={() => {
                        handleOpenPopup('add')
                        setIdLocation(0)
                    }}
                    variant="outline" className="absolute top-0 md:top-1 right-0 flex items-center gap-2 text-white bg-pink-400 border-pink-400 font-semibold h-full p-2 md:px-3 rounded-md cursor-pointer hover:bg-white hover:text-pink-400 hover:shadow-[0_0_10px_#e396c1] transition-all duration-300">
                    <MapPinPlusInside />
                    Thêm
                </Button>
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
                <Controller
                    name="select"
                    control={control}
                    render={({ field }) => (
                        <Select defaultValue="all" onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-[220px] min-h-10">
                                <SelectValue placeholder="Loại" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                {dataListProvince?.map((item: ProvinceItem) => (
                                    <SelectItem key={item.code} value={item.name}>{item.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

            </div>

            <div className="border border-[#eee] rounded-lg shadow-sm w-full">
                <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-7 2xl:gap-5 p-6 empty:p-0">
                    {listLocationFS && listLocationFS?.map((item: LocationItem, index: number) => {
                        return <LocationItemDetail key={index} data={item} handleValueOpenPopup={handleValueOpenPopup} />
                    })}
                </div>
                {listLocationFS && listLocationFS?.length <= 0 && <div className="text-center p-10 text-gray-400">{`Không tìm thấy kết quả "${keywordSearch || selectSearch} "`}</div>}
                <div className="flex items-center justify-between flex-col gap-3 lg:flex-row px-6 py-5 border-t border-gray-200">
                    <p className="text-gray-500 text-sm text-center">Hiển thị {listLocationFS?.length ?? 0 } vị trí mỗi trang <span className="sm:inline-block hidden">-</span><br className="sm:hidden" /> Tổng cộng {dataListLocation?.totalRow} vị trí</p>

                    {totalPg > 1 &&
                        <div className="block">
                            <PaginationCustom setPagi={setLocationPagi} pageIndex={dataListLocation?.pageIndex} pageSize={dataListLocation?.pageSize} totalRow={dataListLocation?.totalRow} />
                        </div>
                    }
                </div>
            </div>
            <Dialog open={isPopup} onOpenChange={setIsPopup}>
                {mode === "add" && <LocationPopup mode="add" />}
                {mode === "edit" && <LocationPopup mode="edit" />}
            </Dialog>
        </>
    )
}
