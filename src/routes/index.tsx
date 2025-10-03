import { lazy, Suspense, type FC, type LazyExoticComponent } from "react";
import type { RouteObject } from "react-router-dom";

const Loading = lazy(() => import('@/components/layouts/Loading'));
// Home
const HomeLayout = lazy(() => import('@/layouts/HomeLayout'));
const HomePage = lazy(() => import('@/pages/HomeTemplate/HomePage'));
const AboutPage = lazy(() => import('@/pages/HomeTemplate/AboutPage'));
const RoomsPage = lazy(() => import('@/pages/HomeTemplate/RoomsPage'));
const RoomDetailPage = lazy(() => import("@/pages/HomeTemplate/RoomDetailPage"));
const ContactPage = lazy(() => import('@/pages/HomeTemplate/ContactPage'));
// Auth
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));
const LoginPage = lazy(() => import('@/pages/AuthTemplate/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/AuthTemplate/RegisterPage'));
// Admin
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));
const Dashboard = lazy(() => import('@/pages/AdminTemplate/Dashboard'));
const AuthManagement = lazy(() => import('@/pages/AdminTemplate/AuthManagement'));
const BookingManagement = lazy(() => import('@/pages/AdminTemplate/BookingManagement'));
const CommentManagement = lazy(() => import('@/pages/AdminTemplate/CommentManagement'));
const LocationManagement = lazy(() => import('@/pages/AdminTemplate/LocationManagement'));
const RoomManagement = lazy(() => import('@/pages/AdminTemplate/RoomManagement'));

const withSuspense = (Component: LazyExoticComponent<FC>) => (
    <Suspense fallback={<Loading />}>
        <Component />
    </Suspense>
)

export const routes: RouteObject[] = [
    {
        path: '/',
        element: withSuspense(HomeLayout),
        children: [
            { path: '', element: withSuspense(HomePage) },
            { path: 'about', element: withSuspense(AboutPage) },
            { path: 'rooms', element: withSuspense(RoomsPage) },
            { path: 'room-detail/:id', element: withSuspense(RoomDetailPage) },
            { path: 'contact', element: withSuspense(ContactPage) }
        ]
    },
    {
        path: '/auth',
        element: withSuspense(AuthLayout),
        children: [
            { path: 'login', element: withSuspense(LoginPage) },
            { path: 'register', element: withSuspense(RegisterPage), }
        ]
    },
    {
        path: '/dashboard',
        element: withSuspense(AdminLayout),
        children: [
            { path: '', element: withSuspense(Dashboard) },
            { path: 'auth-management', element: withSuspense(AuthManagement) },
            { path: 'location-management', element: withSuspense(LocationManagement) },
            { path: 'room-management', element: withSuspense(RoomManagement) },
            { path: 'comment/:roomID', element: withSuspense(CommentManagement) },
            { path: 'booking/:userID', element: withSuspense(BookingManagement) }
        ]
    },
    {
        path: "*",
        element: <div>Not Found</div>,
    },
]