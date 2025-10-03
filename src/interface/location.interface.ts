export interface LocationPagi<T> {
    pageIndex: number;
    pageSize: number;
    totalRow: number;
    keywords: null;
    data: T[];
}

export interface LocationItem {
    id: number;
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
    hinhAnh: string;
}
export interface DistrictsItem {
    code: number;
    codename: string;
    division_type: string;
    name: string;
    province_code: number;
    wards?: any[];
}
export interface ProvinceItem {
    code: number;
    codename: string;
    districts: DistrictsItem[];
    division_type: string;
    name: string;
    phone_code: number;
}