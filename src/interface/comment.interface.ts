export interface CommentItem {
    id: number;
    maPhong: number;
    maNguoiBinhLuan: number;
    ngayBinhLuan: string;
    noiDung: string;
    saoBinhLuan: number;

    tenNguoiBinhLuan?: string;
    avatar?: string;
}