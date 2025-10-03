import { useNavigate, useParams } from "react-router-dom";
import CommentItemDetail from "./CommentItemDetail";
import { useListOfRoomComment } from "@/hooks/useCommentQuery";
import type { CommentItem } from "@/interface/comment.interface";
import { ChevronLeft } from "lucide-react";

export default function CommentManagement() {
    // Param
    let { roomID } = useParams();

    const navigate = useNavigate();

    // API
    const { data: dataComment, isLoading: isLoadingComment } = useListOfRoomComment(Number(roomID));

    return (
        <>
            <div className="relative">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-5 lg:mb-8">Bình luận của Phòng {roomID}</h2>
            </div>
            <div
                onClick={() => navigate("/dashboard/room-management")}
                className="flex gap-1 items-center mb-3 cursor-pointer hover:text-blue-300 transition-all duration-300">
                <ChevronLeft size={16} />Quay lại
            </div>
            <div className="border border-[#eee] rounded-lg shadow-sm w-full p-5 bg-gray-50/20 2xl:p-8">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 2xl:grid-cols-4 sp376:grid-cols-2 2xl:gap-5">
                    {dataComment && dataComment?.map((item: CommentItem) => <CommentItemDetail key={item.id} data={item} />)}
                </div>
                {isLoadingComment && <div className="text-center p-10 text-gray-400">...Loading</div>}
            </div>
        </>
    )
}
