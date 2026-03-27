export declare class RecruitmentPaginationDto {
    search?: string;
    status?: string;
    is_active?: boolean;
    sortBy: string;
    order: 'asc' | 'desc';
    page: number;
    perPage: number;
}
export declare class StatusCountDto {
    is_active?: boolean;
}
