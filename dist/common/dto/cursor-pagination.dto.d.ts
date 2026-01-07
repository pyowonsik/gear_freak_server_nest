export declare class CursorPaginationDto {
    cursor?: number;
    limit?: number;
}
export declare class CursorPaginationResponseDto<T extends {
    id: number;
}> {
    items: T[];
    pagination: {
        cursor: number | null;
        limit: number;
        hasMore: boolean;
    };
    constructor(items: T[], limit: number, hasMore: boolean);
}
