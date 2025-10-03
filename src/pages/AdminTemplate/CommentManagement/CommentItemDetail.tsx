import type { CommentItem } from "@/interface/comment.interface";
import { CalendarDays, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRemoveOfRoomComment } from "@/hooks/useCommentQuery";
import { confirmDialog } from "@/utils/dialog";
import { formatDateSafe } from "@/hooks/useFormatDateSafe";

type CommentItemDetailProp = {
    data: CommentItem
}

export default function CommentItemDetail({ data }: CommentItemDetailProp) {
    const [isAction, setIsAction] = useState<boolean>(false);
  
    // API
    const { mutate: mutateRemove } = useRemoveOfRoomComment();
    const handleRemove = () => {
        confirmDialog({
            title: "Bạn có chắc chắn xóa không"
        }).then((result) => {
            if (result.isConfirmed) {
                mutateRemove(data.id)
            }
        });
    }

    return (
        <div
            onMouseOver={() => setIsAction(true)}
            onMouseLeave={() => setIsAction(false)}
            className={`group ${isAction ? " active" : ""} relative z-0 overflow-hidden border border-[#eee] rounded-lg shadow-sm w-full p-4 flex flex-col md:flex-row items-center md:items-start gap-2.5 cursor-pointer bg-white`}>
            <div className='cursor-pointer size-10 flex items-center justify-center bg-gradient-to-r from-sky-300 to-blue-300 rounded-full shrink-0'>
                {data.avatar ? (<img className="size-10 rounded-full cursor-pointer" src={data.avatar} alt="User dropdown" />) :
                    (<p className='text-lg text-white font-medium'>Us</p>)}
            </div>
            <div className="block w-full">
                <div className="flex flex-col md:flex-row justify-between items-center gap-1 mb-1 md:mb-0 w-full">
                    <p className="font-semibold text-sm line-clamp-1">{data.tenNguoiBinhLuan}</p>
                    <p className="flex justify-center gap-0.5 text-yellow-500 shrink-0 md:ml-2">
                        <Star size={12} />
                        <Star size={12} />
                        <Star size={12} />
                        <Star size={12} />
                        <Star size={12} />
                    </p>
                </div>
                <p className="flex items-center gap-1 text-xs text-gray-400 mb-1 text-center md:text-left md:mb-2"><CalendarDays size={12} />{formatDateSafe(data.ngayBinhLuan)}</p>
                <p className="text-gray-600 text-sm break-all">{data.noiDung}</p>
            </div>
            <div onClick={handleRemove} className="group-[.active]:opacity-100 opacity-0 absolute inset-0 z-2 bg-gray-700/50 transition-all duration-300">
                <Trash2 size={30} className="absolute inset-0 m-auto text-red-400" />
            </div>
        </div>
    )
}
