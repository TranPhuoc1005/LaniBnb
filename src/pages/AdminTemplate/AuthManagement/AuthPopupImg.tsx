import { LoaderCircle, X } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useUpdateUserImage } from "@/hooks/useUserQuery";
import { useAuthStore } from "@/store/auth.store";
import { useUserManagementStore } from "@/store/userManagement.store";



export default function AuthPopupImg() {

    // Store
    const { idUser } = useUserManagementStore();
    console.log("🌲 ~ AuthPopupImg ~ idUser:", idUser)
    const { user, setUser } = useAuthStore();

    const { handleSubmit, watch, setValue, } = useForm<{ avatar: File | null }>({
        defaultValues: {
            avatar: null,
        }
    })

    // API
    const { mutate: mutateUpdateImg, isPending: isPendingUpdateImg } = useUpdateUserImage();

    const avatarLink = watch("avatar");
    const previewImage = (file: File) => {
        const link = URL.createObjectURL(file);
        return link;
    }

    const onSubmit = (data: { avatar: File | null }) => {
        if (!data.avatar) return;
        const formData = new FormData();
        formData.append('formFile', data.avatar)
        mutateUpdateImg(formData, {
            onSuccess: () => {
                if (user?.user.id !== idUser) return;
                const avt: any = data.avatar;
                const linkImage = URL.createObjectURL(avt);
                const newUser = {
                    ...user, user: {
                        ...user?.user,
                        avatar: linkImage,
                    }
                }
                setUser(newUser)
            }
        })
    }

    return (
        <DialogContent className="sm:w-[calc(100%-2rem)] sm:max-w-[800px] p-0 gap-0">
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader className="border-b border-gray-200 p-5">
                    <DialogTitle className="flex items-center gap-4">
                        Avatar
                    </DialogTitle>
                </DialogHeader>
                <div className="overflow-auto">
                    <div className="p-5 max-h-[400px]">
                        <div className="grid gap-4 row-span-3">
                            <div className="block space-y-2">
                                <div className="relative flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-51 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        {!avatarLink && <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>}
                                        {avatarLink &&
                                            <img src={previewImage(avatarLink)} className="w-full max-h-full object-contain" alt="" />
                                        }
                                        <input id="dropzone-file" type="file" accept='.png,jpeg,.jpg' className="hidden"
                                            onChange={(e) => {
                                                const file = e.currentTarget.files?.[0];
                                                if (!file) return
                                                setValue("avatar", file);
                                            }}
                                        />
                                    </label>
                                    {avatarLink &&
                                        <X
                                            onClick={() => {
                                                setValue("avatar", null)
                                            }}
                                            className="absolute z-2 top-3 right-3 cursor-pointer hover:text-red-400 transition-all duration-300" />
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <DialogFooter className="p-5 pt-0">
                    <DialogClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-sky-300 transition-all duration-300 cursor-pointer">
                        {isPendingUpdateImg && <LoaderCircle className="animate-spin" />}
                        Cập nhật
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}
