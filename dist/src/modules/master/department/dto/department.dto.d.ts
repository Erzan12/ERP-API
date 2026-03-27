export declare class CreateDepartmentDto {
    name: string;
    sorting?: number;
    division_id: string;
}
export declare class UpdateDepartmentDto {
    name?: string;
    sorting?: number;
    division_id?: string;
    is_active?: boolean;
}
