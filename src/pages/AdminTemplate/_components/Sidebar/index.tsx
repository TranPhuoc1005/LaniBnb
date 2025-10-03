import { House, MapPinned, Store, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


const MENU_DASHBOARD = [
    { id: 0, icon: <House />, text: 'Bảng điều khiển', link: '' },
    { id: 1, icon: <User />, text: 'Quản lí người dùng', link: 'auth-management' },
    { id: 2, icon: <MapPinned />, text: 'Quản lí vị trí', link: 'location-management' },
    { id: 3, icon: <Store />, text: 'Quản lí tin phòng', link: 'room-management' },
    // { id: 4, icon: <HousePlus />, text: 'Quản lí đặt phòng', link: 'booking' },
    // { id: 5, icon: <MessageSquareText />, text: 'Quản lí bình luận', link: 'comment-management' }
]

export default function Sidebar() {
    const itemMenuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const [itemMenuWidth, setItemMenuWidth] = useState<number>(0);
    const [itemMenuHeight, setItemMenuHeight] = useState<number>(0);
    const [indexActive, setIndexActive] = useState<number>(0);

    const [isMenuSp, setIsMenuSp] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            if (itemMenuRef.current) {
                setItemMenuHeight(itemMenuRef.current.clientHeight)
                setItemMenuWidth(itemMenuRef.current.clientWidth)
            }
            setIsMenuSp(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, []);

    useEffect(() => {
        const local = location.pathname.split('/')[2]
        const isLocal = MENU_DASHBOARD.find(item => {
            if (local === 'booking') {
                return item.link === 'auth-management'
            } else if (local === 'comment') {
                return item.link === 'room-management'
            } else {
                return item.link === local
            }
        });
        setIndexActive(isLocal ? isLocal?.id : 0)
    }, [location]);


    return (
        <div className=" fixed bottom-0 md:top-0 left-0 z-10 w-full md:w-70 p-2 md:pr-0 md:pt-5 md:pl-3 bg-gradient-to-r from-sky-300 to-blue-300 md:group-[.menuSmall]:w-20 duration-300 transition-all overflow-hidden">
            <div className='logo mb-6 text-center group-[.menuSmall]:opacity-0 group-[.menuSmall]:pointer-events-none hidden md:block'>
                <p className='text-5xl font-bold text-pink-200'>LaniBnB</p>
            </div>
            <div className="block relative z-0 w-fit mx-auto flex justify-center md:block md:w-auto gap-1 md:gap-0">
                <div className='SidebarEff' style={isMenuSp ? {
                    transform: `translateX(calc(${itemMenuWidth * indexActive}px + ${4 * indexActive}px))`,
                    width: `${itemMenuWidth}px`
                }
                    : {
                        transform: `translateY(${itemMenuHeight * indexActive}px)`,
                        height: `${itemMenuHeight}px`
                    }
                }>
                    <span className="block bg-pink-200 size-8 md:size-12 rounded-full mx-auto md:mr-0 md:ml-1" />
                </div>
                {
                    MENU_DASHBOARD.map((item) => {
                        const isActive = `group ${indexActive === item.id ? "active" : ""}`
                        return (<div key={item.id} className={isActive} ref={itemMenuRef} onClick={() => setIndexActive(item.id)}>
                            <Link to={item.link} className='flex items-center gap-3 text-white pr-1 md:pr-0 pl-1 py-1 cursor-pointer'>
                                <span className="size-8 md:size-12 rounded-full flex items-center justify-center">
                                    {item.icon}
                                </span>
                                <span className="font-medium text-lg group-[.active]:text-pink-300 transition-all duration-300 md:group-[.menuSmall]:text-[0px] hidden md:block">{item.text}</span>
                            </Link>
                        </div>)
                    })
                }
            </div>
        </div>
    )
}
