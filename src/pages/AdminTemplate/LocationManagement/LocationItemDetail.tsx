import { useRemoveLocation } from '@/hooks/useLocationQuery';
import type { LocationItem } from '@/interface/location.interface';
import { locationManagementStore } from '@/store/locationManagement.store';
import { confirmDialog } from '@/utils/dialog';
import { SquarePen, Trash2 } from 'lucide-react'
import { useState } from 'react';

type LocationItemDetailProps = {
    data: LocationItem,
    handleValueOpenPopup: (data: string) => void
}

export default function LocationItemDetail({ data, handleValueOpenPopup }: LocationItemDetailProps) {
    //Store
    const { setIdLocation, setSelectedProvinceCode } = locationManagementStore();
    // State
    const [isAction, setIsAction] = useState<boolean>(false);

    // API
    const { mutate: mutateRemove } = useRemoveLocation();
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
        <div
            onMouseOver={() => setIsAction(true)}
            onMouseLeave={() => setIsAction(false)}
            className={`group ${isAction ? " active" : ""} relative z-0 aspect-square rounded-xl overflow-hidden before:content before:absolute before:inset-0 before:bg-black/40 before:z-1`}>
            <img src={data.hinhAnh ? data.hinhAnh : "https://placehold.jp/ababab/ffffff/200x200.jpg?text=NoImg"} className="w-full h-full object-cover" alt={data.tenViTri} />
            <div className="absolute z-2 bottom-3 inset-x-3 text-white 2xl:bottom-5 2xl:inset-x-5">
                <p className="text-lg font-bold line-clamp-1">{data.tenViTri}</p>
                <p className="text-sm line-clamp-1">{data.tinhThanh}</p>
            </div>
            <SquarePen
                onClick={() => {
                    handleValueOpenPopup('edit')
                    setIdLocation(data.id)
                    setSelectedProvinceCode(data.tinhThanh)
                }}
                size={20} className="group-[.active]:opacity-100 opacity-0 absolute z-2 top-4 right-4 text-white cursor-pointer hover:text-yellow-300 transition-all duration-300" />
            <Trash2
                onClick={() => handleDelete(data.id)}
                size={20} className="group-[.active]:opacity-100 opacity-0 absolute z-2 top-4 left-4 text-white cursor-pointer hover:text-red-400 transition-all duration-300" />
        </div>
    )
}
