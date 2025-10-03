import {
    Bed,
    Home,
    Phone,
    User,
    CircleAlert,
    ChevronDown,
    LogOut,
    Shield,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useListLocation } from "@/hooks/useLocationQuery";
import "./_header.scss";

interface MenuContent {
    title: string;
    description: string;
    features: string[];
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    href: string;
    content: MenuContent;
}

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] =
        useState<boolean>(false);
    const [mobileSelectedItem, setMobileSelectedItem] =
        useState<string>("rooms");
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const navRef = useRef<HTMLElement>(null);
    const activeItemRef = useRef<HTMLAnchorElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { user, clearUser } = useAuthStore();
    const isAuthenticated = !!user;

    const { data, isLoading: locationsLoading } = useListLocation(1, 1000);
    const locations = data?.data || [];

    const menuItems: MenuItem[] = [
        {
            id: "home",
            label: "Trang chủ",
            icon: <Home className="w-5 h-5" />,
            href: "/",
            content: { title: "", description: "", features: [] },
        },
        {
            id: "about",
            label: "Giới thiệu",
            icon: <CircleAlert className="w-5 h-5" />,
            href: "/about",
            content: { title: "", description: "", features: [] },
        },
        {
            id: "rooms",
            label: "Phòng",
            icon: <Bed className="w-5 h-5" />,
            href: "/rooms",
            content: { title: "", description: "", features: [] },
        },
        {
            id: "contact",
            label: "Liên hệ",
            icon: <Phone className="w-5 h-5" />,
            href: "/contact",
            content: {
                title: "Thông tin liên hệ",
                description:
                    "Kết nối với chúng tôi để được tư vấn và hỗ trợ tốt nhất",
                features: [
                    "Hotline 24/7: 0934-100-597",
                    "Email: tranphuoc1005@gmail.com",
                    "Địa chỉ: TP. Hồ Chí Minh",
                    "Hỗ trợ đặt phòng online",
                ],
            },
        },
        ...(isAuthenticated
            ? []
            : [
                  {
                      id: "login",
                      label: "Đăng nhập",
                      icon: <User className="w-5 h-5" />,
                      href: "/auth/login",
                      content: { title: "", description: "", features: [] },
                  },
              ]),
    ];

    const getAvatarText = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : "U";
    };

    const handleLogout = () => {
        clearUser();
        setIsUserDropdownOpen(false);
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsUserDropdownOpen(false);
            }
        };

        if (isUserDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isUserDropdownOpen]);

    const updateIndicator = (element: HTMLElement) => {
        if (navRef.current && element) {
            const navRect = navRef.current.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            setIndicatorStyle({
                left: elementRect.left - navRect.left,
                width: elementRect.width,
            });
        }
    };

    const getActiveItem = () => {
        return menuItems.find((item) => item.href === location.pathname);
    };

    const activeItem = getActiveItem();

    useEffect(() => {
        if (activeItemRef.current && activeItem) {
            updateIndicator(activeItemRef.current);
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (activeItemRef.current && activeItem) {
                setTimeout(() => {
                    updateIndicator(activeItemRef.current!);
                }, 100);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [activeItem]);

    return (
        <>
            <header className="glass-effect bg-white/90 shadow-md fixed left-0 right-0 top-0 z-101">
                <div className="max-w-6xl mx-auto flex justify-between items-center py-2 px-5">
                    <h1 className="text-3xl lg:text-4xl font-bold">LaniBnb</h1>

                    <nav
                        ref={navRef}
                        className="md:flex hidden space-x-1 lg:space-x-4 relative"
                    >
                        {activeItem && (
                            <div
                                className="absolute top-0 bg-gradient-to-r from-sky-300 to-blue-300 rounded-lg transition-all duration-300 ease-out opacity-90"
                                style={{
                                    left: `${indicatorStyle.left}px`,
                                    width: `${indicatorStyle.width}px`,
                                    height: "100%",
                                    zIndex: -1,
                                }}
                            />
                        )}

                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    to={item.href}
                                    key={item.id}
                                    ref={isActive ? activeItemRef : null}
                                    className={`min-w-[90px] flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-all duration-200 relative z-10 ${
                                        isActive
                                            ? "text-white"
                                            : "text-gray-700 hover:text-sky-300"
                                    }`}
                                >
                                    {item.icon}
                                    <span className="font-medium text-sm lg:text-base">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}

                        {isAuthenticated && user && (
                            <div className="relative -top-1" ref={dropdownRef}>
                                <button
                                    onClick={() =>
                                        setIsUserDropdownOpen(
                                            !isUserDropdownOpen
                                        )
                                    }
                                    className="min-w-[90px] flex flex-col items-center px-2 py-1 rounded-lg text-gray-700 hover:text-sky-300"
                                >
                                    <div className="relative">
                                        {user.user.avatar ? (
                                            <img
                                                src={user.user.avatar}
                                                alt={user.user.name}
                                                className="w-8 h-8 rounded-xl object-cover border-2 border-gray-300"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-md flex items-center justify-center text-white text-xs font-semibold">
                                                {getAvatarText(user.user.name)}
                                            </div>
                                        )}
                                        <ChevronDown className="w-3 h-3 absolute -bottom-1 -right-1 bg-white" />
                                    </div>
                                    <span className="font-medium text-sm truncate max-w-[90px] leading-4">
                                        {user.user.name}
                                    </span>
                                </button>

                                {/* ✅ Menu dropdown */}
                                {isUserDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <Link
                                            to="/info/"
                                            onClick={() =>
                                                setIsUserDropdownOpen(false)
                                            }
                                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Thông tin</span>
                                        </Link>

                                        {user.user.role === "ADMIN" && (
                                            <Link
                                                to="/admin"
                                                onClick={() =>
                                                    setIsUserDropdownOpen(false)
                                                }
                                                className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                <Shield className="w-4 h-4" />
                                                <span>Trang quản trị</span>
                                            </Link>
                                        )}

                                        <hr className="my-2" />

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </nav>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="relative p-1 lg:p-3 rounded-lg hover:bg-gray-100 transition-colors group focus:outline-none"
                    >
                        <div className="w-6 h-6 flex flex-col justify-center items-center">
                            <span
                                className={`block w-6 h-0.5 bg-gray-600 group-hover:bg-blue-600 transition-all duration-300 ease-in-out ${
                                    isMenuOpen
                                        ? "rotate-45 translate-y-1.5"
                                        : "-translate-y-1"
                                }`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-gray-600 group-hover:bg-blue-600 transition-all duration-300 ease-in-out ${
                                    isMenuOpen ? "opacity-0" : "opacity-100"
                                } my-1`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-gray-600 group-hover:bg-blue-600 transition-all duration-300 ease-in-out ${
                                    isMenuOpen
                                        ? "-rotate-45 -translate-y-1.5"
                                        : "translate-y-1"
                                }`}
                            ></span>
                        </div>
                    </button>
                </div>
            </header>

            <div
                className={`h_menu ${
                    isMenuOpen ? "active" : ""
                } fixed inset-0 z-[100] bg-white top-[70px] lg:top-[80px]`}
            >
                <div className="flex md:flex-row flex-col h-full">
                    <div className="w-full md:w-1/2 bg-gray-900 text-white py-8 flex flex-col h-full md:h-auto">
                        <nav className="space-y-6 flex-1 px-4">
                            {menuItems.map((item) =>
                                item.id !== "rooms" ? (
                                    <Link
                                        to={item.href}
                                        key={item.id}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center space-x-4 w-full text-left p-4 rounded-lg transition-all duration-200 mb-0 text-gray-300 hover:text-white hover:bg-gray-800"
                                    >
                                        {item.icon}
                                        <span className="text-lg font-medium">
                                            {item.label}
                                        </span>
                                    </Link>
                                ) : (
                                    <button
                                        key={item.id}
                                        onClick={() =>
                                            setMobileSelectedItem(item.id)
                                        }
                                        className={`flex items-center space-x-4 w-full text-left p-4 rounded-lg transition-all duration-200 mb-0 ${
                                            mobileSelectedItem === item.id
                                                ? "bg-gradient-to-r from-sky-300 to-blue-300 text-white"
                                                : "text-gray-300 hover:text-white hover:bg-gray-800"
                                        }`}
                                    >
                                        {item.icon}
                                        <span className="text-lg font-medium">
                                            {item.label}
                                        </span>
                                    </button>
                                )
                            )}

                            {isAuthenticated && user && (
                                <>
                                    <div className="border-t border-gray-700 pt-6 mt-6">
                                        <div className="flex items-center space-x-4 p-4 mb-4">
                                            {user.user.avatar ? (
                                                <img
                                                    src={user.user.avatar}
                                                    alt={user.user.name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                                                    {getAvatarText(
                                                        user.user.name
                                                    )}
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-white font-medium">
                                                    {user.user.name}
                                                </div>
                                                <div className="text-gray-400 text-sm">
                                                    {user.user.email}
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            to="/info/"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center space-x-4 w-full text-left p-4 rounded-lg transition-all duration-200 mb-0 text-gray-300 hover:text-white hover:bg-gray-800"
                                        >
                                            <Bed className="w-5 h-5" />
                                            <span className="text-lg font-medium">
                                                Thông tin
                                            </span>
                                        </Link>

                                        {user.user.role === "ADMIN" && (
                                            <Link
                                                to="/admin"
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                                className="flex items-center space-x-4 w-full text-left p-4 rounded-lg transition-all duration-200 mb-0 text-gray-300 hover:text-white hover:bg-gray-800"
                                            >
                                                <Shield className="w-5 h-5" />
                                                <span className="text-lg font-medium">
                                                    Trang quản trị
                                                </span>
                                            </Link>
                                        )}
                                    </div>
                                </>
                            )}
                        </nav>

                        <div className="px-4 pt-4 border-t border-gray-700">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center space-x-2 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transform hover:scale-101 transition-all duration-200"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Đăng xuất</span>
                                </button>
                            ) : (
                                <Link
                                    to={
                                        menuItems.find(
                                            (i) => i.id === mobileSelectedItem
                                        )?.href || "/"
                                    }
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full text-center bg-gradient-to-r from-sky-300 to-blue-300 text-white py-3 rounded-lg font-medium transform hover:scale-101 transition-all duration-200"
                                >
                                    Đi đến{" "}
                                    {
                                        menuItems.find(
                                            (i) => i.id === mobileSelectedItem
                                        )?.label
                                    }
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:block content-area w-full md:w-1/2 p-8 flex justify-center bg-gradient-to-br from-blue-50 to-purple-50 overflow-y-auto">
                        {mobileSelectedItem === "rooms" ? (
                            <div className="w-full">
                                {locationsLoading ? (
                                    <div className="flex items-center justify-center h-32">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-2 text-gray-600">
                                            Đang tải vị trí...
                                        </span>
                                    </div>
                                ) : locations.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {locations.map((location) => (
                                            <div
                                                key={location.id}
                                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group"
                                                onClick={() => {
                                                    navigate(
                                                        `/rooms?location=${
                                                            location.id
                                                        }&locationName=${encodeURIComponent(
                                                            location.tenViTri
                                                        )}&city=${encodeURIComponent(
                                                            location.tinhThanh
                                                        )}`
                                                    );
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                <div
                                                    className="h-32 relative"
                                                    style={{
                                                        background:
                                                            location.hinhAnh &&
                                                            location.hinhAnh.trim() !==
                                                                ""
                                                                ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${location.hinhAnh}) center/cover no-repeat`
                                                                : "",
                                                    }}
                                                >
                                                    <div className="absolute inset-0 bg-black/40 bg-opacity-10 group-hover:bg-opacity-5 transition-all duration-300"></div>
                                                    <div className="absolute bottom-2 left-3">
                                                        <h4 className="text-white font-bold text-lg drop-shadow-lg">
                                                            {location.tenViTri}
                                                        </h4>
                                                        <p className="text-white text-xs opacity-90 drop-shadow">
                                                            {location.tinhThanh}
                                                            , {location.quocGia}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm text-gray-600">
                                                            Khám phá khu vực
                                                        </span>
                                                    </div>
                                                    <button className="w-full bg-gradient-to-r from-sky-300 to-blue-300 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200">
                                                        Xem phòng
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600">
                                            Không có vị trí nào được tìm thấy
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            (() => {
                                const currentContent = menuItems.find(
                                    (i) => i.id === mobileSelectedItem
                                )?.content;
                                if (
                                    currentContent &&
                                    (currentContent.title ||
                                        currentContent.description ||
                                        currentContent.features.length > 0)
                                ) {
                                    return (
                                        <div className="max-w-md">
                                            <div className="mb-6">
                                                <div className="w-16 h-16 bg-gradient-to-r from-sky-300 to-blue-300 rounded-full flex items-center justify-center mb-4">
                                                    {
                                                        menuItems.find(
                                                            (i) =>
                                                                i.id ===
                                                                mobileSelectedItem
                                                        )?.icon
                                                    }
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                                {currentContent.title}
                                            </h3>
                                            <p className="text-gray-600 mb-6 leading-relaxed">
                                                {currentContent.description}
                                            </p>
                                            <ul className="space-y-3">
                                                {currentContent.features.map(
                                                    (f, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-center space-x-3"
                                                        >
                                                            <div className="w-2 h-2 bg-gradient-to-r from-sky-300 to-blue-300 rounded-full"></div>
                                                            <span className="text-gray-700">
                                                                {f}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    );
                                }
                                return null;
                            })()
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
