//Home page
import { Outlet } from 'react-router-dom'
import Header from '../pages/Public/_components/Header'
import Footer from '../pages/Public/_components/Footer'

export default function HomeLayout() {
  return (
    <div className="wrapper">
        <Header />
        <main className="mt-[70px] lg:mt-[80px]">
          <Outlet />
        </main>
        <Footer />
    </div>
  )
}