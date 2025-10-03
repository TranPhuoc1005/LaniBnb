export interface BaseApiResponse<T> {
    statusCode: number;
    message?: string;
    content: T;
    dateTime: Date;
}