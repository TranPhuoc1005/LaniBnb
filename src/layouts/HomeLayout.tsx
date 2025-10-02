//Home page
import { Outlet } from 'react-router-dom'
import Header from '../pages/Public/_components/Header'
import Footer from '../pages/Public/_components/Footer'
import ChatWidget from '@/components/OnlineConsultation/ChatWidget'
import QuickSupport from '@/components/OnlineConsultation/QuickSupport'

export default function HomeLayout() {
  return (
    <div className="wrapper">
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