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
import { Textarea } from "@/components/ui/textarea"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Anvil, Bath, Bed, ChefHat, DollarSign, Image, MapPin, MonitorStop, NotebookPen, School, SquareParking, Store, SunSnow, Users, WashingMachine, WavesLadder, Wifi, X } from "lucide-react"
import { useAddImageRoom, useAddRoom, useDetailRoom, useUpdateRoom } from "@/hooks/useRoomQuery"
import { useForm, Controller } from "react-hook-form"
import { useEffect } from "react"
import { roomManagementStore } from "@/store/roomManagement.store"
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import type { Resolver } from "react-hook-form";
import { useListLocation } from "@/hooks/useLocationQuery"
interface RoomPopupProps {
    mode: "add" | "edit",
}

const schema = z.object({
    id: z.number(),
    tenPhong: z.string().nonempty('Vui lòng nhập tên phòng'),
    khach: z.coerce.number().min(1, "Vui lòng nhập số lượng khách"),
    phongNgu: z.coerce.number().min(1, "Vui lòng nhập số lượng phòng ngủ"),
    giuong: z.coerce.number().min(1, "Vui lòng nhập số lượng giường"),
    phongTam: z.coerce.number().min(1, "Vui lòng nhập số lượng phòng tắm"),
    moTa: z.string().nonempty("Vui lòng nhập mô tả"),
    giaTien: z.coerce.number().min(1, "Vui lòng nhập giá tiền"),
    mayGiat: z.boolean(),
    banLa: z.boolean(),
    tivi: z.boolean(),
    dieuHoa: z.boolean(),
    wifi: z.boolean(),
    bep: z.boolean(),
    doXe: z.boolean(),
    hoBoi: z.boolean(),
    banUi: z.boolean(),
    maViTri: z.coerce.number().min(1, "Vui lòng chọn vị trí"),
    hinhAnh: z.union([z.string(), z.instanceof(File)]).optional(),
});

type RoomItemForms = z.infer<typeof schema>;

export default function RoomPopup({ mode }: RoomPopupProps) {
    // State

    // Store
    const { idRoom } = roomManagementStore()

    // API
    const { data: dataDetail } = useDetailRoom(idRoom);
    const { mutate: mutateAdd } = useAddRoom();
    const { mutate: mutateAddImage } = useAddImageRoom();
    const { mutate: mutateUpdate } = useUpdateRoom();
    const { data: dataLocation } = useListLocation(1, 999);

    // Form
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm<RoomItemForms>({
        defaultValues: {
            "id": 0,
            "tenPhong": "",
            "khach": 0,
            "phongNgu": 0,
            "giuong": 0,
            "phongTam": 0,
            "moTa": "",
            "giaTien": 0,
            "mayGiat": false,
            "banLa": false,
            "tivi": false,
            "dieuHoa": false,
            "wifi": false,
            "bep": false,
            "doXe": false,
            "hoBoi": false,
            "banUi": false,
            "maViTri": 0,
            "hinhAnh": ""
        },
        resolver: zodResolver(schema) as Resolver<RoomItemForms>,
    })

    useEffect(() => {
        if (dataDetail) {
            reset(dataDetail);
        }
    }, [idRoom, dataDetail, reset]);

    const previewImg = watch('hinhAnh');
    const previewImgLink = (file: any) => {
        if (file instanceof Blob || file instanceof File) {
            const link = URL.createObjectURL(file);
            return link;
        }
        return file;
    }

    const onSubmit = (data: RoomItemForms) => {
        console.log("🌲 ~ onSubmit ~ data:", data)
        if (dataDetail?.id) {
            mutateUpdate({
                id: dataDetail.id,
                data: { ...data, hinhAnh: typeof data.hinhAnh === "string" ? data.hinhAnh : "", }
            }, {
                onSuccess: () => {
                    reset()
                }
            })
            if (data.hinhAnh && data.hinhAnh instanceof File) {
                const formData = new FormData();
                formData.append('formFile', data.hinhAnh)
                mutateAddImage({
                    id: dataDetail.id,
                    data: formData
                })
            }

        } else {
            mutateAdd({
                ...data,
                hinhAnh: typeof data.hinhAnh === "string" ? data.hinhAnh : "",
            }, {
                onSuccess: () => reset()
            })
        }
    }

    return (
        <DialogContent className="sm:w-[calc(100%-2rem)] sm:max-w-[800px] p-0 gap-0">
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader className="border-b border-gray-200 p-3 sm:p-5">
                    <DialogTitle className="flex items-center gap-4"><Store className="bg-pink-500 text-white size-10 p-2.5 sm:size-13 sm:p-3 rounded-md" />
                        {mode === "add" ? "Thêm" : "Sửa"} phòng
                    </DialogTitle>
                </DialogHeader>
                <div className="overflow-auto mb-5 sm:mb-2">
                    <div className="max-h-[400px]">
                        <div className="grid sm:grid-cols-2 gap-4 p-5">
                            <div className="grid gap-2">
                                <Label htmlFor="tenPhong"><Store size={18} className="text-red-300" />Tên phòng</Label>
                                <Input className="h-10" id="tenPhong" placeholder="Nhập tên phòng" {...register('tenPhong')} />
                                {errors.tenPhong?.message && <p className="text-red-300 text-xs">{errors.tenPhong?.message}</p>}
                            </div>
                            {mode === "edit" && <div className="grid gap-4 row-span-3">
                                <div className="block space-y-2">
                                    <Label htmlFor="picture"><Image size={18} className="text-green-400" />Hình ảnh</Label>
                                    <div className="relative flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-51 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            {!previewImg && <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>}

                                            {previewImg && <img src={previewImgLink(previewImg)} className="w-full max-h-full object-contain" alt="name" />}
                                            <input id="dropzone-file" type="file" className="hidden"
                                                onChange={(e) => {
                                                    const file: any = e.currentTarget.files?.[0];
                                                    if (!file) return;
                                                    setValue('hinhAnh', file);
                                                }}
                                            />
                                        </label>
                                        {previewImg && <X onClick={() => setValue('hinhAnh', "")} className="absolute z-2 top-1 right-1 cursor-pointer hover:text-red-400 transition-all duration-300" />}
                                    </div>
                                </div>
                            </div>}
                            <div className="grid gap-2">
                                <Label htmlFor="khach"><Users size={18} className="text-blue-500" />Khách</Label>
                                <Input className="h-10" type="number" id="khach" placeholder="Nhập số khách" {...register('khach')} />
                                {errors.khach?.message && <p className="text-red-300 text-xs">{errors.khach?.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="giaTien"><DollarSign size={20} className="text-green-400" />Giá phòng</Label>
                                <Input className="h-10" type="number" id="giaTien" placeholder="Nhập giá phòng" {...register('giaTien')} />
                                {errors.giaTien?.message && <p className="text-red-300 text-xs">{errors.giaTien?.message}</p>}
                            </div>
                            <div className="grid gap-2 row-span-2">
                                <Label htmlFor="moTa"><NotebookPen size={20} className="text-fuchsia-500" />Mô tả</Label>
                                <Textarea id="moTa" placeholder="Type your message here." className="h-[124px]" {...register('moTa')} />
                                {errors.moTa?.message && <p className="text-red-300 text-xs">{errors.moTa?.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phongNgu"><School size={20} className="text-orange-400" />Phòng ngủ</Label>
                                <Input className="h-10" type="number" id="phongNgu" placeholder="Nhập phòng ngủ" {...register('phongNgu')} />
                                {errors.phongNgu?.message && <p className="text-red-300 text-xs">{errors.phongNgu?.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="giuong"><Bed size={20} className="text-cyan-500" />Giường</Label>
                                <Input className="h-10" type="number" id="giuong" placeholder="Nhập số giường" {...register('giuong')} />
                                {errors.giuong?.message && <p className="text-red-300 text-xs">{errors.giuong?.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phongTam"><Bath size={20} className="text-yellow-400" />Phòng tắm</Label>
                                <Input className="h-10" type="number" id="phongTam" placeholder="Nhập phòng tắm" {...register('phongTam')} />
                                {errors.phongTam?.message && <p className="text-red-300 text-xs">{errors.phongTam?.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label><MapPin size={20} className="text-rose-500" />Vị trí</Label>
                                <Controller
                                    name="maViTri"
                                    defaultValue={0}
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={val => field.onChange(val)} value={field.value ? field.value.toString() : undefined}>
                                            <SelectTrigger className="w-full min-h-10">
                                                <SelectValue placeholder="Chọn vị trí" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dataLocation?.data.map(item => <SelectItem key={item.id} value={String(item.id)}>{item.tinhThanh} - {item.tenViTri}</SelectItem>)}
                                                {/* <SelectItem value="11334">Hồ chí minh</SelectItem>
                                                <SelectItem value="11340">Hà nội</SelectItem> */}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.maViTri?.message && <p className="text-red-300 text-xs">{errors.maViTri?.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
                            <p className="font-medium mb-0 col-span-2 sm:col-span-3 lg:col-span-4">Tiện ích</p>
                            <div className="grid gap-2">
                                <Label><WashingMachine size={20} className="text-gray-500" />Máy giặt</Label>
                                <Controller
                                    name="mayGiat"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value ? "mayGiat1" : "mayGiat2"}
                                            onValueChange={(val) => field.onChange(val === "mayGiat1")}
                                            className="flex gap-4">
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="mayGiat1" id="mayGiat1" />
                                                <Label htmlFor="mayGiat1">Có</Label>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="mayGiat2" id="mayGiat2" />
                                                <Label htmlFor="mayGiat2">Không</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label><Anvil size={20} className="text-gray-500" />Bàn ủi</Label>
                                <Controller
                                    name="banUi"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value ? "banUi1" : "banUi2"}
                                            onValueChange={(val) => field.onChange(val === "banUi1")}
                                            className="flex gap-4">
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="banUi1" id="banUi1" />
                                                <Label htmlFor="banUi1">Có</Label>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="banUi2" id="banUi2" />
                                                <Label htmlFor="banUi2">Không</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label><MonitorStop size={20} className="text-gray-500" />Tivi</Label>
                                <Controller
                                    name="tivi"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value ? "tivi1" : "tivi2"}
                                            onValueChange={(val) => field.onChange(val === "tivi1")}
                                            className="flex gap-4">
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="tivi1" id="tivi1" />
                                                <Label htmlFor="tivi1">Có</Label>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="tivi2" id="tivi2" />
                                                <Label htmlFor="tivi2">Không</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label><SunSnow size={20} className="text-gray-500" />Điều hòa</Label>
                                <Controller
                                    name="dieuHoa"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value ? "dieuHoa1" : "dieuHoa2"}
                                            onValueChange={(val) => field.onChange(val === "dieuHoa1")}
                                            className="flex gap-4">
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="dieuHoa1" id="dieuHoa1" />
                                                <Label htmlFor="dieuHoa1">Có</Label>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="dieuHoa2" id="dieuHoa2" />
                                                <Label htmlFor="dieuHoa2">Không</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label><Wifi size={20} className="text-gray-500" />Wifi</Label>
                                <Controller
                                    name="wifi"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value ? "wifi1" : "wifi2"}
                                            onValueChange={(val) => field.onChange(val === "wifi1")}
                                            className="flex gap-4">
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="wifi1" id="wifi1" />
                                                <Label htmlFor="wifi1">Có</Label>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="wifi2" id="wifi2" />
                                                <Label htmlFor="wifi2">Không</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label><ChefHat size={20} className="text-gray-500" />Bếp</Label>
                                <Controller
                                    name="bep"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value ? "bep1" : "bep2"}
                                            onValueChange={(val) => field.onChange(val === "bep1")}
                                            className="flex gap-4">
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="bep1" id="bep1" />
                                                <Label htmlFor="bep1">Có</Label>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="bep2" id="bep2" />
                                                <Label htmlFor="bep2">Không</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label><SquareParking size={20} className="text-gray-500" />Bãi đỗ xe</Label>
                                <Controller
                                    name="doXe"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value ? "doXe1" : "doXe2"}
                                            onValueChange={(val) => field.onChange(val === "doXe1")}
                                            className="flex gap-4">
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="doXe1" id="doXe1" />
                                                <Label htmlFor="doXe1">Có</Label>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="doXe2" id="doXe2" />
                                                <Label htmlFor="doXe2">Không</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label><WavesLadder size={20} className="text-gray-500" />Hồ bơi</Label>
                                <Controller
                                    name="hoBoi"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => (
                                        <RadioGroup
                                            value={field.value ? "hoBoi1" : "hoBoi2"}
                                            onValueChange={(val) => field.onChange(val === "hoBoi1")}
                                            className="flex gap-4">
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="hoBoi1" id="hoBoi1" />
                                                <Label htmlFor="hoBoi1">Có</Label>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <RadioGroupItem value="hoBoi2" id="hoBoi2" />
                                                <Label htmlFor="hoBoi2">Không</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="p-5 pt-0">
                    <DialogClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-sky-300 transition-all duration-300 cursor-pointer">{mode === "add" ? "Thêm" : "Cập nhật"}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}
