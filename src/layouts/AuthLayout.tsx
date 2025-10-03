import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export default function AuthLayout() {
  const { user } = useAuthStore();
  if (user) {
    return <Navigate to={user?.user.role === 'USER' ? '/' : '/dashboard'} />
  }

  return (
    <div className='LoginPage'>
      <Outlet />
    </div>
  )
}
