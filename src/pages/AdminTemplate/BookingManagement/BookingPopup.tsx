import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarDays, ChevronDownIcon, House, User } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useListLocation } from "@/hooks/useLocationQuery"
import { MapPin } from "lucide-react"
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form"
import type { BookingItem } from "@/interface/booking.interface"
import { format } from 'date-fns'
import { useLocationOfRoom } from "@/hooks/useRoomQuery"
import { useAddBooking, useDetailBooking, useUpdateBooking } from "@/hooks/useBookingQuery"
import { useParams } from "react-router-dom"
import { useBookingManagementStore } from "@/store/bookingManagement.store"

interface BookingPopupProps {
  mode: "add" | "edit",
}

export function BookingPopup({ mode }: BookingPopupProps) {
  // 
  const { idBooking } = useBookingManagementStore();

  // Param
  const { userID } = useParams<string>()

  // State
  const [openCheckIn, setOpenCheckIn] = useState(false)
  const [openCheckOut, setOpenCheckOut] = useState(false)
  const [locationDisabled, setLocationDisabled] = useState(true)
  const [locationValue, setLocationValue] = useState<number | null>(null)



  // API
  const { data: dataLocation, } = useListLocation(1, 999);
  const { data: dataRoom, } = useLocationOfRoom(Number(locationValue));
  const { data: dataDetailBook, } = useDetailBooking(Number(idBooking));
  const { mutate: mutateAdd, } = useAddBooking()
  const { mutate: mutateUpdate, } = useUpdateBooking()

  // Form
  const { register: registerBooking, handleSubmit: handleSubmitBooking, control: controlBooking, reset: resetBooking } = useForm<BookingItem>({
    defaultValues: {
      maPhong: 0,
      ngayDen: undefined,
      ngayDi: undefined,
      soLuongKhach: undefined,
      maNguoiDung: Number(userID),
    }
  })

  useEffect(() => {
    resetBooking({
      id: dataDetailBook?.id,
      maPhong: dataDetailBook?.maPhong,
      ngayDen: dataDetailBook?.ngayDen,
      ngayDi: dataDetailBook?.ngayDi,
      soLuongKhach: dataDetailBook?.soLuongKhach,
      maNguoiDung: Number(userID),
    })
  }, [idBooking, dataDetailBook, resetBooking]);

  const onSubmit = (data: BookingItem) => {
    if (data.id) {
      mutateUpdate({
        id: data.id,
        data: data
      })
    } else {
      mutateAdd(data, {
        onSuccess: () => {
          resetBooking()
        }
      })

    }
  }

  return (
    <DialogContent className="sm:w-[calc(100%-2rem)] sm:max-w-[800px] p-0 gap-0">
      <form onSubmit={handleSubmitBooking(onSubmit)}>
        <DialogHeader className="border-b border-gray-200 p-3 sm:p-5">
          <DialogTitle className="flex items-center gap-4">
            {mode === "add" ? "Đặt phòng" : "Sửa phòng"}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto mb-5 sm:mb-2">
          <div className="grid sm:grid-cols-2 gap-4 p-5 max-h-[400px]">
            <div className="grid gap-2">
              <Label htmlFor="date1" className="px-1">
                <CalendarDays size={18} className="text-amber-500" />Ngày đến
              </Label>
              <Controller
                name="ngayDen"
                control={controlBooking}
                render={({ field }) => (
                  <Popover open={openCheckIn} onOpenChange={setOpenCheckIn}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date1"
                        className="justify-between font-normal"
                      >
                        {field.value ? new Date(field.value).toLocaleDateString("en-GB") : "Chọn ngày đến"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        captionLayout="dropdown"
                        onSelect={(dateCheckIn) => {
                          if (dateCheckIn) {
                            const formatted = format(new Date(dateCheckIn), "yyyy-MM-dd")
                            field.onChange(formatted)
                          }
                          setOpenCheckIn(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />

            </div>
            <div className="grid gap-2">
              <Label htmlFor="date2" className="px-1">
                <CalendarDays size={18} className="text-fuchsia-400" />Ngày đi
              </Label>
              <Controller
                name="ngayDi"
                control={controlBooking}
                render={({ field }) => (
                  <Popover open={openCheckOut} onOpenChange={setOpenCheckOut}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date2"
                        className="justify-between font-normal"
                      >
                        {field.value ? new Date(field.value).toLocaleDateString("en-GB") : "Chọn ngày đi"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        captionLayout="dropdown"
                        onSelect={(dateCheckOut) => {
                          if (dateCheckOut) {
                            const formatted = format(new Date(dateCheckOut), "yyyy-MM-dd")
                            field.onChange(formatted)
                          }
                          setOpenCheckOut(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />

            </div>
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="name"><User size={18} className="text-blue-300" />Số lượng khách</Label>
              <Input className="h-10" id="name" placeholder="Nhập số khách" {...registerBooking('soLuongKhach')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name"><MapPin size={18} className="text-red-300" />Vị trí</Label>
              <Select
                onValueChange={(val) => {
                  setLocationValue(Number(val))
                  setLocationDisabled(false)
                }}
              >
                <SelectTrigger className="w-full overflow-hidden">
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {dataLocation?.data.map((item, index) => {
                      return <SelectItem key={index} value={String(item.id)}>{`${item.tinhThanh} - ${item.tenViTri}`}</SelectItem>
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name"><House size={18} className="text-green-300" />Phòng</Label>
              <Controller
                name="maPhong"
                control={controlBooking}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    disabled={locationDisabled}
                  >
                    <SelectTrigger className="w-full overflow-hidden">
                      <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {dataRoom?.map((item, index) => {
                          return <SelectItem key={index} value={String(item.id)}>{item.tenPhong}</SelectItem>
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

            </div>
          </div>
        </div>
        <DialogFooter className="p-5 pt-0">
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
          <Button type="submit" className="bg-sky-300 transition-all duration-300 cursor-pointer">
            {mode === "add" ? "Thêm" : "Cập nhật"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
