import Swal from 'sweetalert2'

type showDialogProps = {
    title?: string,
    text?: string,
    icon?: "success" | "error" | "warning" | "info" | "question",
    confirmColor?: string,
}

export const confirmDialog = (options: showDialogProps) => {
    return Swal.fire({
        title: options.title || "Bạn có chắc chắn không?",
        text: options.text || "",
        icon: options.icon || "warning",
        showCancelButton: true,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
    });
};
export const showDialog = (optional: showDialogProps) => {
    Swal.fire({
        title: optional.title || "",
        text: optional.text || "",
        icon: optional.icon,
        confirmButtonColor: optional.confirmColor || optional.icon == "error" ? "#dc3545" : "#28a745",
        confirmButtonText: "Xác nhận",
    });
}


