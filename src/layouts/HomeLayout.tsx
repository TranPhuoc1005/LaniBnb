import Header from '../pages/HomeTemplate/_components/Header'
import Footer from '../pages/HomeTemplate/_components/Footer'
import { Outlet } from 'react-router-dom'
import ChatWidget from '@/components/OnlineConsultation/ChatWidget'
import QuickSupport from '@/components/OnlineConsultation/QuickSupport'

export default function HomeLayout() {
    return (
        <div id="wrapper" className="homePage">
            <Header />
            <main className="mt-[70px] lg:mt-[80px]">
                <Outlet />
                <ChatWidget />
                <QuickSupport />
            </main>
            <Footer />
        </div>
    )
}
