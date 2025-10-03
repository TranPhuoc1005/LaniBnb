import {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { RoomItem } from "@/interface/room.interface"
import { Anvil, Bath, Bed, ChefHat, DollarSign, MonitorStop, SquareParking, SunSnow, Users, Warehouse, WashingMachine, WavesLadder, Wifi } from "lucide-react"

interface RoomPopupDetailProps {
    data?: RoomItem
}

export default function RoomPopupDetail({ data }: RoomPopupDetailProps) {

    return (
        <DialogContent className="sm:w-[calc(100%-2rem)] sm:max-w-[800px] p-0 gap-0">
            <DialogHeader className="border-b border-gray-200 p-3 sm:p-5">
                <DialogTitle className="flex items-center gap-4">
                    {data?.tenPhong}
                </DialogTitle>
            </DialogHeader>
            <div className="overflow-auto mb-5 sm:mb-2">
                <div className="max-h-[600px]">
                    <div className="block p-6">
                        <div className="img mb-3">
                            <img src={data?.hinhAnh} className="max-h-[300px] w-full object-contain" alt={data?.tenPhong} />
                        </div>
                        <p className="mb-4">{data?.moTa}</p>
                        <div className="grid grid-cols-3 mb-4">
                            <div className="flex items-center gap-1">
                                <p className="font-medium flex items-center gap-1"><Users size={20} className="text-gray-700" />Khách</p>
                                <p className="">{data?.khach}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="font-medium flex items-center gap-1"><Warehouse size={20} className="text-gray-700" />Phòng ngủ</p>
                                <p className="">{data?.phongNgu}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="font-medium flex items-center gap-1"><Bed size={20} className="text-gray-700" />Giường</p>
                                <p className="">{data?.giuong}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="font-medium flex items-center gap-1"><Bath size={20} className="text-gray-700" />Phòng tắm</p>
                                <p className="">{data?.phongTam}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="font-medium flex items-center gap-1"><DollarSign size={20} className="text-gray-700" />Giá tiền</p>
                                <p className="">{data?.giaTien}</p>
                            </div>
                        </div>

                        <p className="font-medium mb-2">Tiện ích</p>
                        <div className="grid grid-cols-3">
                            <div className={`flex items-center gap-1 font-medium ${data?.mayGiat ? "line-through text-gray-400" : ""}`}>
                                <WashingMachine size={20} />Máy giặt
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${data?.banUi ? "line-through text-gray-400" : ""}`}>
                                <Anvil size={20} />Bàn ủi
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${data?.tivi ? "line-through text-gray-400" : ""}`}>
                                <MonitorStop size={20} />Tivi
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${data?.dieuHoa ? "line-through text-gray-400" : ""}`}>
                                <SunSnow size={20} />Điều hòa
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${data?.wifi ? "line-through text-gray-400" : ""}`}>
                                <Wifi size={20} />Wifi
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${data?.bep ? "line-through text-gray-400" : ""}`}>
                                <ChefHat size={20} />Bếp
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${data?.doXe ? "line-through text-gray-400" : ""}`}>
                                <SquareParking size={20} />Bãi đỗ xe
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${data?.hoBoi ? "line-through text-gray-400" : ""}`}>
                                <WavesLadder size={20} />Hồ bơi
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    )
}
