export declare class CreatePositionDto {
    name: string;
    hierarchy?: string;
    job_description?: string;
    sorting?: number;
    department_id: string;
}
export declare class UpdatePositionDto {
    name?: string;
    hierarchy?: string;
    job_description?: string;
    sorting?: number;
    department_id?: string;
    is_active: boolean;
}
