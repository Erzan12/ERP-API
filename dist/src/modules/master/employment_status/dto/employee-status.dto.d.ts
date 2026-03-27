export declare class CreateEmployeeStatusDto {
    code: string;
    label: string;
}
declare const UpdateEmployeeStatusDto_base: import("@nestjs/common").Type<Partial<CreateEmployeeStatusDto>>;
export declare class UpdateEmployeeStatusDto extends UpdateEmployeeStatusDto_base {
}
export {};
