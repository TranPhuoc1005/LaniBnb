import { Outlet } from 'react-router-dom'

import Header from '@/pages/AdminTemplate/_components/Header'
import Sidebar from '@/pages/AdminTemplate/_components/Sidebar'
import { useDashboardStore } from '@/store/dashboard.store';
import { useEffect } from 'react';

export default function AdminLayout() {
    // const { user } = useAuthStore();
    // if (user) {
    //     return <Navigate to={user?.user.role === 'USER' ? '/' : '/dashboard'} />
    // }
    const { isMenu, setIsMenuSp } = useDashboardStore()
    useEffect(() => {
        const handleResize = () => {
            const winWidth = window.innerWidth;
            setIsMenuSp(winWidth <= 1279)
        }
        handleResize();
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, []);
    
    return (
        <div className={`${isMenu ? "group menuSmall" : ""}`}>
            <Header />
            <div className='block'>
                <Sidebar />
                <div className='relative w-full mt-15 md:mt-20 md:pl-70 md:group-[.menuSmall]:pl-20 transition-all duration-300'>
                    <div className='p-5 lg:p-10'><Outlet /></div>
                </div>
            </div>
        </div>
    )
}
