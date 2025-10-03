import { useListUserPagi } from "@/hooks/useUserQuery";
import { Chart } from "./Chart";
import { ListData } from "./ListData";
import { useListRoom } from "@/hooks/useRoomQuery";
import { useListLocation } from "@/hooks/useLocationQuery";
import { useListBooking } from "@/hooks/useBookingQuery";
import { useQueries } from "@tanstack/react-query";
import { detailUserApi } from "@/services/user.api";

export default function Dashboard() {

    // API
    const { data: dataUser } = useListUserPagi(1, 1);
    const { data: dataRoom } = useListRoom(1, 1);
    const { data: dataLocation } = useListLocation(1, 1);
    const { data: dataBooking } = useListBooking();
    // History dataBooking
    const dataBookingSort = dataBooking?.sort((a, b) => b.id - a.id).slice(0, 5);
    // get list of unique userId from booking
    const userIds = [...new Set(dataBookingSort?.map(item => item.maNguoiDung) || [])];
    // call multiple APIs User Details
    const userQueries = useQueries({
        queries: userIds.map(id => ({
            queryKey: ["userDetail", id],
            queryFn: () => detailUserApi(id),
            enabled: !!id,
        }))
    })
    // mapping: attach user info to booking
    
    const bookingWithUser = dataBookingSort?.map(item => {
        const user = userQueries.find(q => q.data?.id === item.maNguoiDung)?.data
        return { ...item, user }
    })

    return (
        <div className="min-h-screen bg-gray-50 pb-14 md:pb-0 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-sky-300 to-blue-300 text-white p-3 md:py-5 lg:px-6 flex justify-between items-center">
                <h1 className="text-xl md:text-2xl xl:text-3xl font-bold">Tổng Quan</h1>
            </div>
            {/* 3 box */}
            <div className="p-4 md:p-6 xl:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div className="bg-white p-4 xl:p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="flex justify-between items-center">
                            <h2 className="text-gray-700 font-medium text-xl md:text-lg lg:text-xl">Người Dùng</h2>
                            <span className="bg-gradient-to-r from-sky-300 to-blue-300 p-2 rounded-lg">
                                <svg
                                    className="w-8 h-8 text-white dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                        </div>
                        <p className="text-3xl font-bold mt-4">{dataUser?.totalRow}</p>
                    </div>
                    <div className="bg-white p-4 xl:p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="flex justify-between items-center">
                            <h2 className="text-gray-700 font-medium text-xl md:text-lg lg:text-xl">Số Phòng</h2>
                            <span className="bg-gradient-to-r from-sky-300 to-blue-300  p-2 rounded-lg">
                                <svg
                                    className="w-8 h-8 text-white dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M2.535 11A3.981 3.981 0 0 0 2 13v4a1 1 0 0 0 1 1h2v1a1 1 0 1 0 2 0v-1h10v1a1 1 0 1 0 2 0v-1h2a1 1 0 0 0 1-1v-4c0-.729-.195-1.412-.535-2H2.535ZM20 9V8a4 4 0 0 0-4-4h-3v5h7Zm-9-5H8a4 4 0 0 0-4 4v1h7V4Z" />
                                </svg>
                            </span>
                        </div>
                        <p className="text-3xl font-bold mt-4 ">{dataRoom?.totalRow}</p>
                    </div>
                    <div className="bg-white p-4 xl:p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="flex justify-between items-center">
                            <h2 className="text-gray-700 font-medium text-xl md:text-lg lg:text-xl">Vị Trí</h2>
                            <span className="bg-gradient-to-r from-sky-300 to-blue-300  p-2 rounded-lg">
                                <svg
                                    className="w-8 h-8 text-white dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5 9a7 7 0 1 1 8 6.93V21a1 1 0 1 1-2 0v-5.07A7.001 7.001 0 0 1 5 9Zm5.94-1.06A1.5 1.5 0 0 1 12 7.5a1 1 0 1 0 0-2A3.5 3.5 0 0 0 8.5 9a1 1 0 0 0 2 0c0-.398.158-.78.44-1.06Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                        </div>
                        <p className="text-3xl font-bold mt-4">{dataLocation?.totalRow}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <Chart data={dataBooking} />
                </div>
                <div>
                    <ListData data={bookingWithUser ?? []} />
                </div>
            </div>
        </div>
    );
}
