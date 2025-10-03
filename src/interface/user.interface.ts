export interface ListUserPagi<T> {
    pageIndex: number;
    pageSize: number;
    totalRow: number;
    keywords: null;
    data: T[];
}

export interface ListUser {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    avatar: string;
    gender: boolean;
    role: string;
    accessToken?: string;
}

export interface UserPostResponse {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    gender: boolean;
    role: string;
    avatar?: string;
}

export interface UserPutResponse {
    id?: number;
    name: string;
    email: string;
    phone: string;
    birthday: string;
    gender: boolean;
    role: string;
}

export interface UpdateUserVars {
    id: number,
    data: UserPutResponse,
}

export interface UpdateUserImage<T> {
    token: string,
    data: T,
}
