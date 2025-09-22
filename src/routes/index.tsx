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

const withSuspense = (Component: LazyExoticComponent<FC>) => {
  return <Suspense fallback={<LoadingUI/>}><Component/></Suspense>
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
        path: '/bookings',
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
    ]
  },
  {
    path: '/login',
    element: withSuspense(LoginPage)
  }
]
