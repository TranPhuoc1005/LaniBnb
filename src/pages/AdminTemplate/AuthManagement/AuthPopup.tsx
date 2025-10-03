import { CalendarDays, ChevronDownIcon, CircleUser, LoaderCircle, Mail, Phone, SquareAsterisk, User, UserRoundPen, VenusAndMars } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { useEffect, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from 'date-fns'

import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { UserPostResponse } from "@/interface/user.interface"
import { useAddUser, useDetailUser, useUpdateUser } from "@/hooks/useUserQuery";
import { useUserManagementStore } from "@/store/userManagement.store";
import { useAuthStore } from "@/store/auth.store";

interface AuthPopupProps {
    mode: "add" | "edit",
}

const schema = z.object({
    id: z.number(),
    name: z.string().nonempty("Vui lòng nhập họ tên"),
    email: z.string().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Vui lòng nhập đúng định dạng @"),
    password: z.string().nonempty("Vui lòng nhập mật khẩu"),
    phone: z.string().regex(/^[0-9]+$/, "Vui lòng nhập số"),
    birthday: z.string().nonempty("Vui lòng nhập ngày sinh"),
    gender: z.boolean().optional().refine((val) => val !== undefined, {
        message: "Vui lòng chọn giới tính",
    }),
    role: z.string().nonempty("Vui lòng chọn cấp bậc"),
});


const schemaAdd = schema;
const schemaEdit = schema.extend({
    password: z.string().optional(),
})

type AuthPopupForms = z.infer<typeof schema>;

export default function AuthPopup({ mode }: AuthPopupProps) {
    // Store
    const { idUser } = useUserManagementStore();
    const { user, setUser } = useAuthStore();

    const resolverSchema = mode === "add" ? schemaAdd : schemaEdit;

    const [openDate, setOpenDate] = useState(false)
    const { register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<AuthPopupForms>({
        defaultValues: {
            id: 0,
            name: '',
            email: '',
            password: '',
            phone: '',
            birthday: '',
            gender: undefined,
            role: '',
        },
        resolver: zodResolver(resolverSchema as typeof schema)
    })

    // API
    const { data: dataDetailUser } = useDetailUser(idUser);
    const { mutate: mutateAdd, isPending: isPendingAdd } = useAddUser();
    const { mutate: mutateUpdate, isPending: isPendingUpdate } = useUpdateUser();

    // GetUserId
    useEffect(() => {
        if (!idUser || !dataDetailUser) return;
        reset({
            id: dataDetailUser?.id,
            name: dataDetailUser?.name,
            email: dataDetailUser?.email,
            phone: dataDetailUser?.phone,
            birthday: dataDetailUser?.birthday,
            gender: dataDetailUser?.gender,
            role: dataDetailUser?.role,
        })

    }, [idUser, dataDetailUser, reset]);

    const onSubmit = (data: AuthPopupForms) => {
        if (dataDetailUser?.id) {
            mutateUpdate({
                id: dataDetailUser.id,
                data: data as UserPostResponse,
            }, {
                onSuccess: () => {
                    if (user?.user.id !== data.id) return
                    const newUser = {
                        ...user, user: {
                            ...user?.user,
                            ...data
                        }
                    }
                    setUser(newUser)
                }
            });
        } else {
            mutateAdd(data as UserPostResponse, {
                onSuccess: () => {
                    reset({
                        id: 0,
                        name: '',
                        email: '',
                        password: '',
                        phone: '',
                        birthday: '',
                        gender: undefined,
                        role: '',
                    })
                }
            })
        }
    }

    return (
        <DialogContent className="sm:w-[calc(100%-2rem)] sm:max-w-[800px] p-0 gap-0">
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader className="border-b border-gray-200 p-5">
                    <DialogTitle className="flex items-center gap-4">
                        <UserRoundPen className="bg-pink-400 text-white size-10 p-2.5 sm:size-13 sm:p-3 rounded-md" />
                        {mode === "add" ? "Thêm người dùng" : "Sửa người dùng"}
                    </DialogTitle>
                </DialogHeader>
                <div className="overflow-auto mb-5">
                    <div className="grid sm:grid-cols-2 gap-4 p-5 max-h-[600px]">
                        <div className="grid gap-2">
                            <Label htmlFor="email"><Mail size={18} className="text-red-300" />Email</Label>
                            <Input className="h-10" id="email" placeholder="Nhập email @gmail.com" {...register("email")} />
                            {errors.email?.message && <p className="text-red-300 text-xs">{errors.email?.message}</p>}
                        </div>
                        {mode === "add" && <div className="grid gap-2">
                            <Label htmlFor="password"><SquareAsterisk size={18} className="text-blue-300" />Mật khẩu</Label>
                            <Input className="h-10" id="password" placeholder="Nhập mật khẩu" {...register("password")} />
                            {errors.password?.message && <p className="text-red-300 text-xs">{errors.password?.message}</p>}
                        </div>}
                        <div className="grid gap-2">
                            <Label htmlFor="name"><User size={20} className="text-yellow-400" />Họ tên</Label>
                            <Input className="h-10" id="name" placeholder="Nhập họ tên" {...register("name")} />
                            {errors.name?.message && <p className="text-red-300 text-xs">{errors.name.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone"><Phone size={18} className="text-green-400" />Số điện thoại</Label>
                            <Input className="h-10" id="phone" placeholder="Nhập số điện thoại" {...register("phone")} />
                            {errors.phone?.message && <p className="text-red-300 text-xs">{errors.phone?.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gender"><VenusAndMars size={19} className="text-pink-300" />Giới tính</Label>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => field.onChange(val === "nam")}
                                        value={field.value === undefined ? undefined
                                            : field.value ? "nam" : "nu"}
                                    >
                                        <SelectTrigger className="w-full min-h-10">
                                            <SelectValue placeholder="Chọn giới tính" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="nam">Nam</SelectItem>
                                                <SelectItem value="nu">Nữ</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.gender?.message && <p className="text-red-300 text-xs">{errors.gender?.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="birthday" className="px-1">
                                <CalendarDays size={20} className="text-indigo-400" />
                                Ngày sinh
                            </Label>
                            <Controller
                                name="birthday"
                                control={control}
                                render={({ field }) => (
                                    <Popover open={openDate} onOpenChange={setOpenDate}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="date"
                                                className="w-full justify-between font-normal h-10"
                                            >
                                                {field.value ? new Date(field.value).toLocaleDateString("en-GB") : "Chọn ngày"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                captionLayout="dropdown"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const formatted = format(new Date(date), "yyyy-MM-dd")
                                                        field.onChange(formatted)
                                                    }
                                                    setOpenDate(false)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.birthday?.message && <p className="text-red-300 text-xs">{errors.birthday?.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role"><CircleUser size={20} className="text-orange-300" />Cấp bậc</Label>
                            <Controller
                                name="role"
                                control={control}
                                defaultValue="USER"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full min-h-10">
                                            <SelectValue placeholder="Chọn cấp bậc" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="USER">user</SelectItem>
                                                <SelectItem value="ADMIN">admin</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.role?.message && <p className="text-red-300 text-xs">{errors.role?.message}</p>}
                        </div>
                    </div>
                </div>
                <DialogFooter className="p-5 pt-0">
                    <DialogClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-sky-300 transition-all duration-300 cursor-pointer">
                        {isPendingAdd || isPendingUpdate && <LoaderCircle className="animate-spin" />}
                        {mode === "add" ? "Thêm" : "Cập nhật"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}
