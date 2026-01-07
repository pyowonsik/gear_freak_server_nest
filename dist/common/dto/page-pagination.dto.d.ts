export declare enum SortBy {
    latest = "latest",
    oldest = "oldest",
    priceAsc = "priceAsc",
    priceDesc = "priceDesc",
    popular = "popular"
}
export declare class PagePaginationDto {
    page?: number;
    limit?: number;
    sortBy?: SortBy;
    get offset(): number;
}
export declare class PaginationResponseDto<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
    constructor(items: T[], total: number, page: number, limit: number);
}
