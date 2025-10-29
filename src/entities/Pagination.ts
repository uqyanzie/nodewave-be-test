export interface PaginationResponse<T> {
    page: number;
    take: number;
    items: T[]
}