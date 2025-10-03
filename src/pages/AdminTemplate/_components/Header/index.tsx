import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store'
import { useEffect, useRef, useState } from 'react';
import { useDashboardStore } from '@/store/dashboard.store';

export default function Header() {
  // Store
  const { setIsMenu } = useDashboardStore();
  const { user, clearUser } = useAuthStore();
  // console.log("🌲 ~ Header ~ user:", user?.user)
  // State
  const [isActiveHamburger, setIsActiveHamburger] = useState<boolean>(false);
  const [isActiveAvatar, setIsActiveAvatar] = useState<boolean>(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Handle
  const navigate = useNavigate()
  const handleLogout = () => {
    clearUser();
    navigate('/auth/login')
  }

  const handleToggleHamburger = () => {
    setIsActiveHamburger(!isActiveHamburger)
    setIsMenu()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setIsActiveAvatar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='fixed z-9 top-0 inset-x-0 h-15 md:h-20 shadow-2xs md:pl-70 md:group-[.menuSmall]:pl-20 transition-all duration-300 bg-white'>
      <div className='flex justify-between items-center px-3 md:px-5 lg:px-10 h-full'>
        <div className='hidden md:block'>
          <button
            className={` btn-hamburger hamburger hamburger--squeeze ${isActiveHamburger ? "is-active" : ""}`}
            onClick={handleToggleHamburger}
            type="button">
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button>
        </div>

        <div className='md:hidden'>
          <p className='text-3xl font-bold text-pink-200'>LaniBnB</p>
        </div>

        {/* Avatar */}
        <div className='relative' ref={avatarRef}>
          <div className='flex items-center gap-3' onClick={() => setIsActiveAvatar(!isActiveAvatar)}>
            <div className='cursor-pointer size-10 flex items-center justify-center bg-gradient-to-r from-sky-300 to-blue-300 rounded-full'>
              {user?.user.avatar ? (<img className="size-10 rounded-full cursor-pointer" src={user?.user.avatar} alt="User dropdown" />) :
                (<p className='text-lg text-white font-medium'>{user?.user.role === "ADMIN" ? 'Ad' : 'Us'}</p>)}
            </div>
            <div className='font-medium hidden md:block'>{user?.user.name}</div>
          </div>
          {isActiveAvatar && <div className="absolute top-[120%] overflow-hidden right-0 z-10 bg-white divide-y divide-gray-200 rounded-md shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
            {/* <ul className="text-sm text-gray-700 dark:text-gray-200">
              <li>
                <p className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Thông tin</p>
              </li>
            </ul> */}
            <p onClick={handleLogout} className="cursor-pointer px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Đăng xuất</p>
          </div>}
        </div>
      </div>
    </div>
  )
}
