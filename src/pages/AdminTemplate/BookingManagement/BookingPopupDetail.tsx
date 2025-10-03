import {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useDetailRoom } from "@/hooks/useRoomQuery"
import { useBookingManagementStore } from "@/store/bookingManagement.store"
import { Anvil, Bath, Bed, ChefHat, DollarSign, MonitorStop, SquareParking, SunSnow, Users, Warehouse, WashingMachine, WavesLadder, Wifi } from "lucide-react"

// interface BookingPopupDetailProps {
//     data?: any
// }

export default function BookingPopupDetail() {
    // Store
    const { idBookingRoom } = useBookingManagementStore();

    const { data: dataRoomDetail } = useDetailRoom(Number(idBookingRoom))

    return (
        <DialogContent className="sm:w-[calc(100%-2rem)] sm:max-w-[1000px] p-0 gap-0">
            <DialogHeader className="border-b border-gray-200 p-3 sm:p-5">
                <DialogTitle className="flex items-center gap-4">
                    {dataRoomDetail?.tenPhong}
                </DialogTitle>
            </DialogHeader>
            <div className="overflow-auto mb-5 sm:mb-2">
                <div className="max-h-[600px]">
                    <div className="block p-6">
                        <div className="img  mb-3">
                            <img src={dataRoomDetail?.hinhAnh} className="w-full max-h-[300px] object-contain" alt={dataRoomDetail?.tenPhong} />
                        </div>
                        <p className="mb-4">
                            {dataRoomDetail?.moTa}
                        </p>

                        <div className="grid grid-cols-3 mb-4">
                            <div className="flex items-center gap-1">
                                <p className="font-medium flex items-center gap-1"><Users size={20} className="text-gray-700" />Khách</p>
                                <p className="">{dataRoomDetail?.khach}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="font-medium flex items-center gap-1"><Warehouse size={20} className="text-gray-700" />Phòng ngủ</p>
                                <p className="">{dataRoomDetail?.phongNgu}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="font-medium flex items-center gap-1"><Bed size={20} className="text-gray-700" />Giường</p>
                                <p className="">{dataRoomDetail?.giuong}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="font-medium flex items-center gap-1"><Bath size={20} className="text-gray-700" />Phòng tắm</p>
                                <p className="">{dataRoomDetail?.phongTam}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="font-medium flex items-center gap-1"><DollarSign size={20} className="text-gray-700" />Giá tiền</p>
                                <p className="">{dataRoomDetail?.giaTien}$</p>
                            </div>
                        </div>

                        <p className="font-medium mb-2">Tiện ích</p>
                        <div className="grid grid-cols-3">
                            <div className={`flex items-center gap-1 font-medium ${!dataRoomDetail?.mayGiat && 'line-through text-gray-500'}`}>
                                <WashingMachine size={20} />Máy giặt
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${!dataRoomDetail?.banUi && 'line-through text-gray-500'}`}>
                                <Anvil size={20} />Bàn ủi
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${!dataRoomDetail?.tivi && 'line-through text-gray-500'}`}>
                                <MonitorStop size={20} />Tivi
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${!dataRoomDetail?.dieuHoa && 'line-through text-gray-500'}`}>
                                <SunSnow size={20} />Điều hòa
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${!dataRoomDetail?.wifi && 'line-through text-gray-500'}`}>
                                <Wifi size={20} />Wifi
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${!dataRoomDetail?.bep && 'line-through text-gray-500'}`}>
                                <ChefHat size={20} />Bếp
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${!dataRoomDetail?.doXe && 'line-through text-gray-500'}`}>
                                <SquareParking size={20} />Bãi đỗ xe
                            </div>
                            <div className={`flex items-center gap-1 font-medium ${!dataRoomDetail?.hoBoi && 'line-through text-gray-500'}`}>
                                <WavesLadder size={20} />Hồ bơi
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    )
}
