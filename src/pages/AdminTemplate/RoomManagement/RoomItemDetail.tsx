import { useDetailLocation } from "@/hooks/useLocationQuery";
import { useRemoveRoom } from "@/hooks/useRoomQuery";
import type { RoomItem } from "@/interface/room.interface";
import { roomManagementStore } from "@/store/roomManagement.store";
import { confirmDialog } from "@/utils/dialog";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type RoomItemDetailProps = {
    data: RoomItem,
    handleValueOpenPopup: (data: string) => void,
}

export default function RoomItemDetail({ data, handleValueOpenPopup }: RoomItemDetailProps) {
    // State
    const [isAction, setIsAction] = useState<boolean>(false);

    // Navigate
    const navigate = useNavigate();

    // Store
    const { setIdRoom } = roomManagementStore();

    // Api
    const { data: dataLocation } = useDetailLocation(data.maViTri);
    const { mutate: mutateRemove } = useRemoveRoom();
    // Handle
    const handleDelete = (id: number) => {
        confirmDialog({
            title: "Bạn có chắc chắn xóa không"
        }).then((result) => {
            if (result.isConfirmed) {
                mutateRemove(id)
            }
        });
    }


    return (
        <div className="space-y-2">
            <div
                onMouseOver={() => setIsAction(true)}
                onMouseLeave={() => setIsAction(false)}
                className={`group ${isAction ? " active" : ""} relative z-0 aspect-square rounded-xl overflow-hidden before:content before:absolute before:inset-0 before:bg-black/20 before:z-1`}>
                <img src={data.hinhAnh ? data.hinhAnh : "https://placehold.jp/ababab/ffffff/235x235.jpg?text=NoImg"} className="w-full h-full object-cover" alt={data.tenPhong} />
                <SquarePen
                    onClick={() => {
                        handleValueOpenPopup('edit')
                        setIdRoom(data.id)
                    }}
                    size={20} className="group-[.active]:opacity-100 opacity-0 absolute z-2 top-4 right-4 text-white cursor-pointer hover:text-yellow-300 transition-all duration-300" />
                <Trash2
                    onClick={() => handleDelete(data.id)}
                    size={20} className="group-[.active]:opacity-100 opacity-0 absolute z-2 top-4 left-4 text-white cursor-pointer hover:text-red-400 transition-all duration-300" />
                <Eye
                    onClick={() => {
                        setIdRoom(data.id)
                        navigate(`/dashboard/comment/${data.id}`)
                    }}
                    className="group-[.active]:opacity-100 opacity-0 absolute inset-0 text-white m-auto cursor-pointer z-2 hover:text-blue-300 transition-all duration-300" size={30} />
            </div>
            <div className="block text-sm">
                <p
                    onClick={() => {
                        handleValueOpenPopup('detail')
                        setIdRoom(data.id)
                    }}
                    className="font-medium line-clamp-1 mb-0.5 cursor-pointer duration-300 transition-all hover:text-blue-500">{data.tenPhong}</p>
                <div className="flex justify-between items-center">
                    <p className="line-clamp-1 text-gray-400">{dataLocation?.tinhThanh} - {dataLocation?.tenViTri}</p>
                    <p className="line-clamp-1 text-gray-500 font-medium pl-2 shrink-0">{data.giaTien}$</p>
                </div>
            </div>
        </div>
    )
}
