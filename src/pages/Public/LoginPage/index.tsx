import React, { useState, useEffect } from "react";
import { User, Lock, Hotel, ArrowLeft, ArrowRight, Mail, AlertCircle, Loader2, Phone, Calendar, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { userAuthStore } from "@/store/auth.store";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    // Auth store
    const { 
        signIn, 
        signUp, 
        loading, 
        error, 
        clearError, 
        isAuthenticated 
    } = userAuthStore();

    // Form states
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });

    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        birthday: "",
        gender: true,
        role: "USER" as "USER" | "ADMIN"
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    // Clear error when switching forms
    useEffect(() => {
        clearError();
    }, [isLogin, clearError]);

    // Handle login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!loginForm.email || !loginForm.password) {
            return;
        }

        const success = await signIn({
            email: loginForm.email,
            password: loginForm.password
        });

        if (success) {
            navigate("/");
        }
    };

    // Handle register
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!registerForm.name || !registerForm.email || !registerForm.password) {
            return;
        }

        const success = await signUp({
            name: registerForm.name,
            email: registerForm.email,
            password: registerForm.password,
            phone: registerForm.phone || undefined,
            birthday: registerForm.birthday || undefined,
            gender: registerForm.gender,
            role: registerForm.role
        });

        if (success) {
            // Reset form đăng ký
            setRegisterForm({
                name: "",
                email: "",
                password: "",
                phone: "",
                birthday: "",
                gender: true,
                role: "USER"
            });
            
            // Chuyển về form đăng nhập
            setIsLogin(true);
            
            // Có thể thêm thông báo thành công (optional)
            // toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-sky-200 via-blue-200 to-purple-200">
            <div className="absolute inset-0">
                <img
                    src="./images/login_bg.jpg"
                    alt="Hotel"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20"></div>
            </div>

            <div className="relative mx-4 z-10 w-full max-w-md p-8 bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="flex flex-col items-center mb-2">
                    <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-4 rounded-full shadow-lg">
                        <Hotel className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="mt-2 text-2xl font-bold text-gray-800">LaniBnb</h1>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg flex items-center space-x-2"
                    >
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm text-red-700">{error}</span>
                    </motion.div>
                )}

                {/* Animate form */}
                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h2 className="text-xl font-semibold mb-4 text-center">
                                Đăng nhập
                            </h2>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={loginForm.email}
                                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu"
                                        value={loginForm.password}
                                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="relative w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white py-3 rounded-lg font-semibold hover:scale-[1.02] transition-transform mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 absolute left-4 top-0 bottom-0 my-auto animate-spin" />
                                            Đang đăng nhập...
                                        </>
                                    ) : (
                                        <>
                                            Đăng nhập
                                            <ArrowRight className="w-5 h-5 absolute right-4 top-0 bottom-0 my-auto" />
                                        </>
                                    )}
                                </button>
                                <Link
                                    to={"/"}
                                    className="relative block text-center w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
                                >
                                    <ArrowLeft className="w-5 h-5 absolute left-4 top-0 bottom-0 my-auto" />
                                    <span>Về trang chủ</span>
                                </Link>
                            </form>
                            <p className="mt-6 text-center text-sm text-gray-600">
                                Chưa có tài khoản?{" "}
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className="text-blue-600 font-semibold hover:underline"
                                    disabled={loading}
                                >
                                    Đăng ký ngay
                                </button>
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.4 }}
                            className="max-h-[80vh] overflow-y-auto"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-center">
                                Đăng ký
                            </h2>
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Tên hiển thị"
                                        value={registerForm.name}
                                        onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={registerForm.email}
                                        onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu"
                                        value={registerForm.password}
                                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        placeholder="Số điện thoại (tùy chọn)"
                                        value={registerForm.phone}
                                        onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        placeholder="Ngày sinh (tùy chọn)"
                                        value={registerForm.birthday}
                                        onChange={(e) => setRegisterForm({...registerForm, birthday: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
                                        disabled={loading}
                                    />
                                </div>
                                
                                {/* Gender Selection */}
                                <div className="flex items-center space-x-4 px-3 py-2 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600 font-medium">Giới tính:</span>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            checked={registerForm.gender === true}
                                            onChange={() => setRegisterForm({...registerForm, gender: true})}
                                            className="text-purple-500"
                                            disabled={loading}
                                        />
                                        <span className="text-sm">Nam</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            checked={registerForm.gender === false}
                                            onChange={() => setRegisterForm({...registerForm, gender: false})}
                                            className="text-purple-500"
                                            disabled={loading}
                                        />
                                        <span className="text-sm">Nữ</span>
                                    </label>
                                </div>

                                {/* Role Selection */}
                                <div className="relative">
                                    <Shield className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <select
                                        value={registerForm.role}
                                        onChange={(e) => setRegisterForm({...registerForm, role: e.target.value as "USER" | "ADMIN"})}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none bg-white appearance-none cursor-pointer"
                                        disabled={loading}
                                    >
                                        <option value="USER">Người dùng</option>
                                        <option value="ADMIN">Quản trị viên</option>
                                    </select>
                                    <div className="absolute right-3 top-0 bottom-0 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white py-3 rounded-lg font-semibold hover:scale-[1.02] transition-transform mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Đang đăng ký...
                                        </>
                                    ) : (
                                        "Đăng ký"
                                    )}
                                </button>
                                <Link
                                    to={"/"}
                                    className="relative block text-center w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold py-3 rounded-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
                                >
                                    <ArrowLeft className="w-5 h-5 absolute left-4 top-0 bottom-0 my-auto" />
                                    <span>Về trang chủ</span>
                                </Link>
                            </form>
                            <p className="mt-6 text-center text-sm text-gray-600">
                                Đã có tài khoản?{" "}
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className="text-blue-600 font-semibold hover:underline"
                                    disabled={loading}
                                >
                                    Đăng nhập
                                </button>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}