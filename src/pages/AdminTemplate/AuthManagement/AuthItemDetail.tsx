import type { ListUser } from '@/interface/user.interface';
import { Eye, SquarePen, Trash2 } from 'lucide-react';
import { useRemoveUser } from '@/hooks/useUserQuery';
import { confirmDialog } from '@/utils/dialog';
import { useUserManagementStore } from '@/store/userManagement.store';
import { useNavigate } from 'react-router-dom';
import { formatDateSafe } from '@/hooks/useFormatDateSafe';

type AuthItemDetailProps = {
    data: ListUser
    handleValueOpenPopup: (data: string) => void,
}
export default function AuthItemDetail({ data, handleValueOpenPopup }: AuthItemDetailProps) {
    const birthday = data.birthday.replaceAll('-', '/').slice(0, 10)
    // navigate
    const navigate = useNavigate();

    // Store
    const { setIdUser } = useUserManagementStore();

    // State

    // API
    const { mutate: mutateRemove } = useRemoveUser();

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
        <tr className="bg-white border-t border-gray-200 hover:bg-gray-50 text-gray-800">
            <td className="py-3 px-4 pl-6">
                <div className={`size-12 rounded-full bg-gray-300 rounded overflow-hidden cursor-pointer relative`}>
                    {
                        data.avatar ?
                            (<img className="w-full h-full object-cover" alt={data.name} src={data.avatar} onError={(e) => e.currentTarget.src="https://placehold.jp/ababab/ffffff/200x200.jpg?text=NoImg"} />) :
                            (
                                <div className="cursor-pointer w-full h-full flex items-center justify-center bg-gradient-to-r from-sky-300 to-blue-300 rounded-full">
                                    <p className="text-lg text-white font-medium">
                                        {data.role === 'ADMIN' ? 'Ad' : "Us"}
                                    </p>
                                </div>
                            )
                    }
                    {/* <div className='group-[.active]:opacity-100 absolute inset-0 bg-gray-200/40 flex items-center justify-center transition-all duration-300 opacity-0'>
                        <Pencil className='text-gray-800' size={18} />
                    </div> */}
                </div>
            </td>
            <td className="py-3 px-4">
                <p className="font-medium">{data.name}</p>
            </td>
            <td className="py-3 px-4">
                <p className="">{data.email}</p>
            </td>
            <td className="py-3 px-4">
                <p className=" ">{data.password}</p>
            </td>
            <td className="py-3 px-4">
                <p className="">{formatDateSafe(birthday)}</p>
            </td>
            <td className="py-3 px-4">
                <p className="">{data.phone}</p>
            </td>
            <td className="py-3 px-4">
                <p className="">{data.gender ? "Nam" : "Nữ"}</p>
            </td>
            <td className="py-3 px-4">
                <p className="">{data.role.toUpperCase()}</p>
            </td>
            <td className="py-3 px-4">
                <div className="flex gap-2">
                    <Eye onClick={() => navigate(`/dashboard/booking/${data.id}`)} size={20} className='cursor-pointer text-blue-500 hover:text-blue-800' />
                    <SquarePen
                        onClick={() => {
                            handleValueOpenPopup('edit')
                            setIdUser(data.id)
                        }}
                        className="cursor-pointer text-yellow-500 hover:text-yellow-800" size={20} />
                    <Trash2 onClick={() => handleDelete(data.id)} className="cursor-pointer text-red-500 hover:text-red-800" size={20} />
                </div>
            </td>
        </tr>
    )
}
