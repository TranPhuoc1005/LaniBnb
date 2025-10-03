import { HousePlus } from "lucide-react";
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
import RoomPopup from "./RoomPopup";
import RoomPopupDetail from "./RoomPopupDetail";
import RoomItemDetail from "./RoomItemDetail";
import { useDetailRoom, useListRoom, useLocationOfRoom } from "@/hooks/useRoomQuery";
import type { RoomItem } from "@/interface/room.interface";
import PaginationCustom from "../_components/PaginationCustom";
import { usePaginationStore } from "@/store/pagination.store";
import { roomManagementStore } from "@/store/roomManagement.store";
import { useDebounce } from "@/hooks/useDebounce";
import { useForm, Controller } from "react-hook-form";
import { useListLocation } from "@/hooks/useLocationQuery";


export default function RoomManagement() {
    // State
    const [mode, setMode] = useState<"add" | "edit" | "detail" | null>(null);
    const [dataRoomNew, setDataRoomNew] = useState<RoomItem[] | null>(null);

    // Store
    const { roomPagi, setRoomPagi } = usePaginationStore();
    const { isPopup, setIsPopup, idRoom, setIdRoom } = roomManagementStore();

    // Handle
    const handleOpenPopup = (modeData: any,) => {
        setMode(modeData)
        setIsPopup()
    }

    const handleValueOpenPopup = (data: string) => {
        handleOpenPopup(data);
    }

    // Form
    const { register, watch, control } = useForm({
        defaultValues: {
            keyword: '',
            select: 'all',
        },
    })

    const keywordSearch = watch('keyword');
    const selectSearch = watch('select');
    // Api
    const keyworDebounce = useDebounce(keywordSearch, 500)
    const { data: dataListRoom, } = useListRoom(roomPagi, 18, keyworDebounce);
    const { data: dataDetailRoom, } = useDetailRoom(idRoom);

    const { data: dataLocation } = useListLocation(1, 999);
    const { data: dataLocationRoom } = useLocationOfRoom(Number(selectSearch));
    const totalPg = dataListRoom?.totalRow ? Math.ceil(dataListRoom?.totalRow / dataListRoom?.pageSize) : 0;

    useEffect(() => {
        let dataNew: RoomItem[] = dataListRoom?.data || [];

        if (selectSearch !== "all") {
            dataNew = dataLocationRoom || [];
        }

        if (keywordSearch) {
            dataNew = dataNew.filter(item => item.tenPhong.toLowerCase().includes(keywordSearch.toLowerCase()));
        }

        setDataRoomNew(dataNew)

    }, [selectSearch, keywordSearch, dataListRoom, dataLocationRoom]);

    return (
        <>
            <div className="relative">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-5 lg:mb-8">Quản lý phòng</h2>
                <Button
                    onClick={() => {
                        handleOpenPopup('add')
                        setIdRoom(0)
                    }}
                    variant="outline" className="absolute top-0 md:top-1 right-0 flex items-center gap-2 text-white bg-pink-400 border-pink-400 font-semibold h-full p-2 md:px-3 rounded-md cursor-pointer hover:bg-white hover:text-pink-400 hover:shadow-[0_0_10px_#e396c1] transition-all duration-300">
                    <HousePlus />
                    Thêm
                </Button>
            </div>

            <div className="mb-6 flex gap-2 sp400:gap-4">
                <Input placeholder="Tìm phòng" className="max-w-85 h-10" {...register("keyword")} />
                <Controller
                    name="select"
                    control={control}
                    render={({ field }) => (
                        <Select defaultValue="all" onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-[180px] min-h-10">
                                <SelectValue placeholder="Chọn vị trí" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                {dataLocation?.data.map(item => <SelectItem key={item.id} value={String(item.id)}>{item.tinhThanh} - {item.tenViTri}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                />

            </div>

            <div className="border border-[#eee] rounded-lg shadow-sm w-full">
                <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 2xl:gap-5 p-6">
                    {dataRoomNew && dataRoomNew?.map((item: RoomItem, index: number) => (
                        <RoomItemDetail key={index} data={item} handleValueOpenPopup={handleValueOpenPopup} />
                    ))}
                </div>
                {dataRoomNew && dataRoomNew?.length <= 0 && <div className="text-center pb-6 text-gray-400">{`Không tìm thấy kết quả "${keywordSearch}"`}</div>}
                <div className="flex items-center justify-between flex-col gap-3 lg:flex-row px-6 py-5 border-t border-gray-200">
                    <p className="text-gray-500 text-sm text-center">Hiển thị {dataListRoom?.data.length ?? 0} phòng mỗi trang <span className="sm:inline-block hidden">-</span><br className="sm:hidden" /> Tổng cộng {dataListRoom?.totalRow} phòng</p>

                    {totalPg > 1 &&
                        <div className="block">
                            <PaginationCustom setPagi={setRoomPagi} pageIndex={dataListRoom?.pageIndex} pageSize={dataListRoom?.pageSize} totalRow={dataListRoom?.totalRow} />
                        </div>
                    }
                </div>
            </div>
            <Dialog open={isPopup} onOpenChange={setIsPopup}>
                {mode === "add" && <RoomPopup mode="add" />}
                {mode === "edit" && <RoomPopup mode="edit" />}
                {mode === "detail" && <RoomPopupDetail data={dataDetailRoom} />}
            </Dialog>
        </>
    )
}
