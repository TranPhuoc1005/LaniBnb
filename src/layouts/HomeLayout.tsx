//Home page
import { Outlet } from 'react-router-dom'
import Header from '../pages/Public/_components/Header'
import Footer from '../pages/Public/_components/Footer'

export default function HomeLayout() {
  return (
    <>
        <Header />
        <main className="mt-[52px] md:mt-[72px]">
          <Outlet />
        </main>
        <Footer />
    </>
  )
}