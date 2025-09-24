import { lazy, Suspense, type FC, type LazyExoticComponent } from "react";
import LoadingUI from "../components/layout/Loading";
import type { RouteObject } from "react-router-dom";

const HomeLayout = lazy(() => import("../layouts/HomeLayout"));
const HomePage = lazy(() => import("../pages/Public/HomePage"));
const AboutPage = lazy(() => import("../pages/Public/AboutPage"));
const RoomsPage = lazy(() => import("../pages/Public/RoomsPage"));
const RoomDetailPage = lazy(() => import("../pages/Public/RoomDetailPage"));
const UserProfilePage = lazy(() => import("../pages/Public/UserProfilePage"));
const LoginPage = lazy(() => import("../pages/Public/LoginPage/"));
const ContactPage = lazy(() => import("../pages/Public/ContactPage"));
const ChatDashboard = lazy(() => import("../pages/Admin/Dashboard"));
const ChatManagement = lazy(() => import("../pages/Admin/ChatManagement"));

const withSuspense = (Component: LazyExoticComponent<FC>) => {
  return <Suspense fallback={<LoadingUI />}><Component/></Suspense>
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: withSuspense(HomeLayout),
    children: [
      {
        index: true,   
        element: withSuspense(HomePage)
      },
      {
        path: '/about',
        element: withSuspense(AboutPage)
      },
      {
        path: '/info',
        element: withSuspense(UserProfilePage)
      },
      {
        path: '/rooms',
        element: withSuspense(RoomsPage)
      },
      {
        path: '/room-detail/:id',
        element: withSuspense(RoomDetailPage)
      },
      {
        path: '/contact',
        element: withSuspense(ContactPage)
      },
    ]
  },
  {
    path: '/login',
    element: withSuspense(LoginPage)
  },
  {
    path: '/dashboard',
    element: withSuspense(ChatDashboard)
  },
  {
    path: '/chat-management',
    element: withSuspense(ChatManagement)
  }
]
