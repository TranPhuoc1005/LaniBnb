import type { BookingItem } from '@/interface/booking.interface';
import { Eye, SquarePen, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useBookingManagementStore } from '@/store/bookingManagement.store';
import { useRemoveBooking } from '@/hooks/useBookingQuery';

type BookingItemDetailProps = {
    data: BookingItem,
    handleValueOpenPopup: (data: string) => void,
}

export default function BookingItemDetail({ data, handleValueOpenPopup }: BookingItemDetailProps) {
    // Store
    const { setIdBookingRoom, setIdBooking } = useBookingManagementStore();

    // Api
    const { mutate: mutateRemove } = useRemoveBooking()

    // Handle
    const handleDelete = (id: string) => {
        mutateRemove(id)
    }

    return (
        <tr className="bg-white border-t border-gray-200 hover:bg-gray-50 text-gray-800">
            <td className="py-3 px-4">
                <p className="">{data?.ngayDen && format(new Date(data?.ngayDen), 'dd/MM/yyy')}</p>
            </td>
            <td className="py-3 px-4">
                <p className="">{data?.ngayDi && format(new Date(data?.ngayDi), 'dd/MM/yyy')}</p>
            </td>
            <td className="py-3 px-4">
                <p className="">{data?.maPhong}</p>
            </td>
            <td className="py-3 px-4">
                <p className="">{data?.soLuongKhach}</p>
            </td>
            <td className="py-3 px-4">
                <div className="flex gap-2">
                    <Eye
                        onClick={() => {
                            handleValueOpenPopup('detail');
                            setIdBookingRoom(data?.maPhong);
                        }}
                        className="cursor-pointer text-blue-500 hover:text-blue-800" size={20} />
                    <SquarePen
                        onClick={() => {
                            handleValueOpenPopup('edit')
                            setIdBooking(data.id)
                        }}
                        className="cursor-pointer text-yellow-500 hover:text-yellow-800" size={20} />
                    <Trash2
                        onClick={() => handleDelete(String(data?.id))}
                        className="cursor-pointer text-red-500 hover:text-red-800" size={20} />
                </div>
            </td>
        </tr>
    )
}
